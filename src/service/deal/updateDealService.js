const { response } = require("express");
const {
  searchDeal,
  searchDealAssociates,
} = require("../../model/deal/searchDealModel");
const { searchLineItems } = require("../../model/lineItem/searchLineItem");
const { updateLineItem } = require("../../model/lineItem/updateLineItem");
const { createProduct } = require("../../model/product/createProductModel");
const { createLineItem } = require("../../model/lineItem/createLineItem");
const { updateDeal } = require("../../model/deal/updateDealModel");
const { dateFormat } = require("../../utils/validations");
const { deletePropertiesHS } = require("../../utils/functions");
const { searchProducts } = require("../../model/product/searchproductModel");

const updateDealService = async (body) => {
  const { produtos } = body;

  const responseIdQuote = await searchDeal(body);

  if (!responseIdQuote) {
    return `Não encontramos o negócio com o ID: ${body.id_da_cotacao}`;
  }

  try {
    if (responseIdQuote.length > 0) {
      const { id } = responseIdQuote[0];

      const responseLineItemAssociatedsDeals = await searchDealAssociates(
        id,
        "line_items"
      );

      const responseLineItems = await searchLineItems(
        responseLineItemAssociatedsDeals.results
      );

      console.log("Response Line Itens", responseLineItems)
      /**Verificar se a alteração de produtos é igual a quantidade de produto no body */
      if (body) {
        const { instrumentador, paciente, data_hora_cirurgia, dealstage } =
          body;
        const { newDate, horaDaCirurgia } = dateFormat(data_hora_cirurgia);
        const data = {
          properties: {
            horario_da_cirurgia: horaDaCirurgia,
            instrumentador,
            nome_do_paciente: paciente,
            data_da_cirurgia: newDate,
            dealstage,
          },
        };
        await updateDeal(id, data);
      }

      if (responseLineItems.length !== 0 && responseLineItems) {
        await Promise.all(
          responseLineItems.map(async (item) => {
            const url = `crm/v4/objects/deals/${id}/associations/line_items/${item.id}`;
            await deletePropertiesHS(url);
          })
        );
      }

      const productsAssociateds = [];
      const existingProducts = await searchProducts(produtos);

      if (existingProducts.length !== produtos.length || !existingProducts) {
        if (existingProducts.length === 0 || !existingProducts) {
          for (const product of produtos) {
            const {
              properties: {
                quantidade,
                price,
                hs_object_id,
                name,
                sku_mais_pratico,
              },
            } = await createProduct(product);
            const dataAssociates = {
              properties: {
                quantity: quantidade,
                price,
                hs_product_id: hs_object_id,
                name,
                sku_mais_pratico,
              },
              associations: [
                {
                  to: {
                    id: id,
                  },
                  types: [
                    {
                      associationCategory: "HUBSPOT_DEFINED",
                      associationTypeId: 20,
                    },
                  ],
                },
              ],
            };
            productsAssociateds.push(dataAssociates);
          }
        } else {
          for (const product of produtos) {
            if (
              existingProducts.every(
                (item) =>
                  Number(item.properties.hs_sku) !==
                  Number(product.sku_mais_pratico)
              )
            ) {
              const {
                properties: {
                  quantidade,
                  price,
                  hs_object_id,
                  name,
                  sku_mais_pratico,
                },
              } = await createProduct(product);
              const dataAssociates = {
                properties: {
                  quantity: quantidade,
                  price,
                  hs_product_id: hs_object_id,
                  name,
                  sku_mais_pratico,
                },
                associations: [
                  {
                    to: {
                      id: id,
                    },
                    types: [
                      {
                        associationCategory: "HUBSPOT_DEFINED",
                        associationTypeId: 20,
                      },
                    ],
                  },
                ],
              };
              productsAssociateds.push(dataAssociates);
            } else {
              const { sku_mais_pratico, quantidade, price, nomeDoProduto } =
                product;
              let productId;
              existingProducts.forEach((item) => {
                if (
                  Number(item.properties.hs_sku) === Number(sku_mais_pratico)
                ) {
                  productId = item.properties.sku_mais_pratico;
                }
              });
              const dataAssociates = {
                properties: {
                  quantity: Number(quantidade),
                  price: Number(price),
                  hs_product_id: productId,
                  name: nomeDoProduto,
                  sku_mais_pratico,
                },
                associations: [
                  {
                    to: {
                      id: id,
                    },
                    types: [
                      {
                        associationCategory: "HUBSPOT_DEFINED",
                        associationTypeId: 20,
                      },
                    ],
                  },
                ],
              };
              productsAssociateds.push(dataAssociates);
            }
          }
        }
      } else if (existingProducts.length === produtos.length) {
        for (const {
          sku_mais_pratico,
          quantidade,
          price,
          nomeDoProduto,
        } of produtos) {
          const allProductsAreEquals = existingProducts.some(
            ({ properties }) => properties.hs_sku === sku_mais_pratico
          );
          let productId;
          existingProducts.forEach(({ properties }) => {
            Number(properties.sku_mais_pratico) === Number(sku_mais_pratico)
              ? (productId = properties.hs_object_id)
              : productId;
          });
          if (allProductsAreEquals) {
            const dataLineItem = {
              properties: {
                sku_mais_pratico,
                quantity: quantidade,
                price: price,
                name: nomeDoProduto,
                hs_product_id: productId,
              },
              associations: [
                {
                  to: {
                    id: id,
                  },
                  types: [
                    {
                      associationCategory: "HUBSPOT_DEFINED",
                      associationTypeId: 20,
                    },
                  ],
                },
              ],
            };
            productsAssociateds.push(dataLineItem);
          }
        }
      }

      Promise.all(
        productsAssociateds.map(async (properties) => {
          await createLineItem(properties);
        })
      );

      return {
        message: "Negócio Atualizado com Sucesso!",
        dealName: responseIdQuote[0].properties.dealname,
        dealId: responseIdQuote[0].id,
      };
    }
  } catch (error) {
    return error.message;
  }
};
module.exports = { updateDealService };
