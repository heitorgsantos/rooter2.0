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
  const { negocio, empresa, medico, produtos, contato } = body;

  const respondeIdQuotes = await searchDeal(negocio);
  const existingCompanies = await searchCompanie(empresa);
  const existingContact = await searchContact(medico, "medico");
  const existingProducts = await searchProducts(produtos);
  const contactOperator = await searchContact(contato, "operador");

  const productsAssociateds = [];

  const responseIdCompanie =
    existingCompanies.length > 0
      ? existingCompanies[0].id
      : await createCompanie(empresa);

  const responseIdContact =
    existingContact.length > 0
      ? existingContact[0].id
      : await createContact(medico, "medico");


      const responseIdOperator =
      contactOperator.length > 0
        ? contactOperator[0].id
        : await createContact(contato, "operador");

        console.log(contactOperator)


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
        {
          types: [
            {
              associationCategory: "USER_DEFINED",
              associationTypeId: 36,
            },
          ],
          to: {
            id: responseIdOperator,
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

    await analyseProdutcts(existingProducts, produtos);
    existingProducts.forEach((inHub) => {
      produtos.forEach((payload) => {
        if (inHub.properties.hs_sku === payload.sku_mais_pratico) {
          inHub.properties.price = payload.price;
        }
      });
    });
    console.log("Produtos cadastrados: ", existingProducts);

    const lineItems = existingProducts.map((items) =>
      formatCreateLineItems(items, responseCreateQuote)
    );

    console.log("Itens de Linhas: ", lineItems[0].associations);

    /**Verificar se os produtos que chegaram estão cadastrado
     * Se não tiver alguns dos que chegaram, cadastrar os produtos;
     * Após ter todos os produtos cadastrados, criar os items de linha dos produtos;
     *
     */
    Promise.all(
      lineItems.map(async (properties) => {
        await createLineItem(properties);
      })
    );

    // console.log("Cotação criada", responseCreateQuote);
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
      idMaisPratico: respondeIdQuotes[0].properties.id_da_cotacao,
    };
  }
};

module.exports = { requestModelCreateDeal };
