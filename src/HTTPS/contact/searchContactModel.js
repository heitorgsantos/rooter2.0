const { searchObject } = require("../../utils/functions");
const { queryDoctor, queryEmail } = require("../../utils/querys");

const searchContact = async (obj, type) => {
const query = type === "medico" ? queryDoctor : queryEmail

  try {
    const url = "/crm/v3/objects/contacts/search";
    const responseSearchContact = await searchObject(url, query(obj));
    return responseSearchContact;
  } catch (error) {
    return error.message;
  }
};

module.exports = { searchContact };
