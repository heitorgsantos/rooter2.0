const { createCompanie } = require("../../model/companie/createCompanieModel");
const { searchCompanie } = require("../../model/companie/searchCompanieModel");
const { createContact } = require("../../model/contact/createContactModel");
const { searchContact } = require("../../model/contact/searchContactModel");
const createDeal = require("../../model/deal/createDealModel");
const { searchDeal } = require("../../model/deal/searchDealModel");
const { createLineItem } = require("../../model/lineItem/createLineItem");
const { createProduct } = require("../../model/product/createProductModel");
const { searchProducts } = require("../../model/product/searchproductModel");
const { dateFormat } = require("../../utils/validations");

const requestModelCreateDeal = async (body) => {
  const { negocio, empresa, medico, produtos } = body;

  console.log("Payload de hoje 01/08/2024", body);

  const respondeIdQuotes = await searchDeal(negocio);
  const existingCompanies = await searchCompanie(empresa);
  const existingContact = await searchContact(medico);
  const existingProducts = await searchProducts(produtos);
  // console.log("Contatos: ", existingContact);

  const productsAssociateds = [];

  const responseIdCompanie =
    existingCompanies.length > 0
      ? existingCompanies[0].id
      : await createCompanie(empresa);

  const responseIdContact =
    existingContact.length > 0
      ? existingContact[0].id
      : await createContact(medico);

  // console.log(
  //   "ID da Empresa: ",
  //   responseIdCompanie,
  //   "ID do Médico: ",
  //   responseIdContact
  // );

  if (!respondeIdQuotes) {
    const {
      instrumentador,
      paciente,
      data_hora_cirurgia,
      convenio,
      id_da_cotacao,
      tipo_de_cotacao,
      procedimento_cirurgico,
    } = negocio;
    const { newDate, horaDaCirurgia } = dateFormat(data_hora_cirurgia);
    // console.log(newDate, horaDaCirurgia);

    const data = {
      associations: [
        {
          types: [
            {
              associationCategory: "USER_DEFINED",
              associationTypeId: 11,
            },
          ],
          to: {
            id: responseIdCompanie,
          },
        },
        {
          types: [
            {
              associationCategory: "USER_DEFINED",
              associationTypeId: 31,
            },
          ],
          to: {
            id: responseIdContact,
          },
        },
      ],
      properties: {
        dealname: paciente,
        instrumentador: instrumentador,
        nome_do_paciente: paciente,
        horario_da_cirurgia: horaDaCirurgia,
        data_da_cirurgia: newDate,
        id_da_cotacao: id_da_cotacao,
        // convenio: convenio,
        pipeline: "default",
        dealstage: "appointmentscheduled",
        tipo_de_cotacao: tipo_de_cotacao,
        prodecd: procedimento_cirurgico,
      },
    };

    const responseCreateQuote = await createDeal(data);

    if (existingProducts.length !== produtos.length) {
      if (existingProducts.length === 0) {
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
                  id: responseCreateQuote.id,
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
                Number(item.properties.sku_mais_pratico) !==
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
                    id: responseCreateQuote.id,
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
            // console.log("Produto já cadastrado", product);
            const { sku_mais_pratico, quantidade, price, nomeDoProduto } =
              product;
            let productId;
            existingProducts.forEach((item) => {
              if (
                Number(item.properties.sku_mais_pratico) ===
                Number(sku_mais_pratico)
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
                    id: responseCreateQuote.id,
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
        console.log("Quantidade");
        const allProductsAreEquals = existingProducts.some(
          ({ properties }) => properties.sku_mais_pratico === sku_mais_pratico
        );
        let productId;
        existingProducts.forEach(({ properties }) => {
          // console.log("PROPERTIES",properties,"SKU+PRATICO", sku_mais_pratico)
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
                  id: responseCreateQuote.id,
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
    // console.log("Produtos para serem associados", productsAssociateds);
    Promise.all(
      productsAssociateds.map(async (properties) => {
        await createLineItem(properties);
      })
    );
    console.log("Cotação criada",responseCreateQuote)
    return {
      status: 201,
      message: "Cotação cadastrada com sucesso!",
      dealId: responseCreateQuote.id,
    };
  } else {
    return {
      status: 200,
      message:
        "O ID da cotação que você tentou cadastrar, já esta cadastrado em nossa base!",
      quoteId: respondeIdQuotes[0].id,
      dealName: respondeIdQuotes[0].properties.dealname,
      idMaisPratico: respondeIdQuotes[0].properties.id_da_cotacao,
    };
  }
};

module.exports = { requestModelCreateDeal };
