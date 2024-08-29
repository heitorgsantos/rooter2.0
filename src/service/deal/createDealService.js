const { createCompanie } = require("../../model/companie/createCompanieModel");
const { searchCompanie } = require("../../model/companie/searchCompanieModel");
const { createContact } = require("../../model/contact/createContactModel");
const { searchContact } = require("../../model/contact/searchContactModel");
const { createDeal } = require("../../model/deal/createDealModel");
const { searchDeal } = require("../../model/deal/searchDealModel");
const { createLineItem } = require("../../model/lineItem/createLineItem");
const { createProduct } = require("../../model/product/createProductModel");
const { searchProducts } = require("../../model/product/searchproductModel");
const {
  analyseProdutcts,
  formatCreateLineItems,
} = require("../../utils/functionProducts");
const { dateFormat } = require("../../utils/validations");

const requestModelCreateDeal = async (body) => {
  const { negocio, empresa, medico, produtos } = body;
  const respondeIdQuotes = await searchDeal(negocio);
  const existingCompanies = await searchCompanie(empresa);
  const existingContact = await searchContact(medico, "medico");
  const existingProducts = await searchProducts(produtos);

  const responseIdCompanie =
    existingCompanies.length > 0
      ? existingCompanies[0].id
      : await createCompanie(empresa);

  const responseIdContact =
    existingContact.length > 0
      ? existingContact[0].id
      : await createContact(medico, "medico");

  if (!respondeIdQuotes) {
    const {
      instrumentador,
      paciente,
      data_hora_cirurgia,
      convenio,
      id_da_cotacao,
      id_ext,
      tipo_de_cotacao,
      procedimento_cirurgico,
    } = negocio;
    const [date, time] = data_hora_cirurgia.split(' ');
    console.log(date)
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
        horario_da_cirurgia: time,
        data_da_cirurgia: dateFormat(date),
        id_da_cotacao: id_ext,
        id_: id_da_cotacao,
        convenio: convenio,
        pipeline: "default",
        dealstage: "appointmentscheduled",
        tipo_de_cotacao,
        prodecd: procedimento_cirurgico,
      },
    };

    const responseProducts = await analyseProdutcts(existingProducts, produtos);
    existingProducts.forEach((inHub) => {
      produtos.forEach((payload) => {
        if (inHub.properties.hs_sku === payload.sku_mais_pratico) {
          inHub.properties.price = payload.price;
        }
      });
    });
 
    let lineItems;
    console.log("Payload para criar negocios", data)
    let responseCreateQuote = await createDeal(data);
    if (responseProducts.length > 0) {
      const responseAnalyseProduct = await analyseProdutcts(
        responseProducts,
        produtos
      );

      lineItems = responseAnalyseProduct.map((item) => {
        let valueUnitary = produtos.find(
          (produto) => produto.sku_mais_pratico === item.properties.hs_sku
        );
        console.log("Valor Unitário: ", valueUnitary);
        item.properties.price = valueUnitary.valor_unitario;
        return formatCreateLineItems(item, responseCreateQuote);
      });
      await Promise.all(
        lineItems.map(async (lineItem) => await createLineItem(lineItem))
      );
    }

    return {
      status: 201,
      message: "Cotação cadastrada com sucesso!",
      dealId: responseCreateQuote.id,
    };
  } else {
    return {
      status: 404,
      message:
        "O ID da cotação que você tentou cadastrar, já esta cadastrado em nossa base!",
      quoteId: respondeIdQuotes[0].id,
      dealName: respondeIdQuotes[0].properties.dealname,
      idMaisPratico: respondeIdQuotes[0].properties.id_,
    };
  }
};

module.exports = { requestModelCreateDeal };
