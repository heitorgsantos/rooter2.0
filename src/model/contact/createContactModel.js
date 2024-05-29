const { postPropertiesHS } = require("../../utils/functions");

const createContact = async (contact) => {
  try {
    const url = "crm/v3/objects/contacts";

    const data = {
      properties: {
        firstname: contact.nome,
        lastname: contact.sobrenome,
        crm_: contact.crm,
        address: contact.rua,
        numero: contact.numero,
        cep: contact.cep,
        bairro: contact.bairro,
        city: contact.cidade,
        email: contact.email,
        phone: contact.telefone,
      },
    };

    const responseCreateContact = await postPropertiesHS(url, data);
    return responseCreateContact.id;
  } catch (error) {
    return { status: error.response.status, message: error.message };
  }
};

module.exports = { createContact };
