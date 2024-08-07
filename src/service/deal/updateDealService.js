const {
  searchDeal,
  searchDealAssociates,
} = require("../../model/deal/searchDealModel");
// const { searchLineItems } = require("../../model/lineItem/searchLineItem");
// const { updateLineItem } = require("../../model/lineItem/updateLineItem");
// const { createProduct } = require("../../model/product/createProductModel");
const { createLineItem } = require("../../model/lineItem/createLineItem");
const { updateDeal } = require("../../model/deal/updateDealModel");
const { dateFormat } = require("../../utils/validations");
const { deletePropertiesHS } = require("../../utils/functions");
const { searchProducts } = require("../../model/product/searchproductModel");
const {
  analyseProdutcts,
  formatCreateLineItems,
} = require("../../utils/functionProducts");

const updateDealService = async (body) => {
  const { produtos } = body;

  const responseIdQuote = await searchDeal(body);
  const existingProducts = await searchProducts(produtos);

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

      await Promise.all(
        responseLineItemAssociatedsDeals.results.map(async (item) => {
          const url = `crm/v4/objects/deals/${id}/associations/line_items/${item.id}`;
          await deletePropertiesHS(url);
        })
      );

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

      await analyseProdutcts(existingProducts, produtos);
      existingProducts.forEach((inHub) => {
        produtos.forEach((payload) => {
          if (inHub.properties.hs_sku === payload.sku_mais_pratico) {
            inHub.properties.price = payload.price;
          }
        });
      });

      const lineItems = existingProducts.map((items) =>
        formatCreateLineItems(items, responseIdQuote[0])
      );

      Promise.all(
        lineItems.map(async (properties) => {
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
