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

const updateDealService = async (body) => {
  const { produtos, negocios } = body;

  const responseIdQuote = await searchDeal(negocios);

  if (responseIdQuote.length > 0) {
    const { id } = responseIdQuote[0];

    const responseLineItemAssociatedsDeals = await searchDealAssociates(
      id,
      "line_items"
    );
    const responseLineItems = await searchLineItems(
      responseLineItemAssociatedsDeals.results
    );
    /**Verificar se a alteração de produtos é igual a quantidade de produto no body */
    if (negocios) {
      const { instrumentador, paciente, data_hora_cirurgia, dealstage } = negocios;
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

    if (produtos.length > 0) {
      if (responseLineItems.length === produtos.length) {
        for (const { sku_mais_pratico, price, quantidade } of produtos) {
          responseLineItems.forEach(async ({ properties }) => {
            if (
              Number(sku_mais_pratico) === Number(properties.sku_mais_pratico)
            ) {
              const data = {
                properties: {
                  price,
                  quantity: quantidade,
                },
              };
              await updateLineItem(properties.hs_object_id, data);
              return "Negócio Atualizado com Sucesso!";
            }
          });
        }
      } else {
        for (const product of produtos) {
          let lineItemId;
          let itemNotDefined;
          responseLineItems.forEach(({ properties }) => {
            properties.sku_mais_pratico === product.sku_mais_pratico
              ? (lineItemId = properties.hs_object_id)
              : (itemNotDefined = properties.hs_object_id);
          });
          if (lineItemId) {
            console.log(lineItemId);
            const { price, quantidade } = product;
            const data = {
              properties: {
                price,
                quantity: quantidade,
              },
            };
            await updateLineItem(lineItemId, data);
            return "Negócio Atualizado com Sucesso!";
          } else {
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
            await createLineItem(dataAssociates);
            return { message: "Negócio Atualizado com Sucesso!" };
          }
        }
      }
    }

    /**Se quantidade de produto for diferente, verificar qual é a diferença e fazer associações */

    /**Verificar se todos os produtos são iguais */
  }
};
module.exports = { updateDealService };
