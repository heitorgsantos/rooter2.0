const { searchObject } = require("../../utils/functions");
const { queryDoctor } = require("../../utils/querys");

const searchContact = async (doctor) => {
  try {
    const url = "/crm/v3/objects/contacts/search";
    const responseSearchContact = await searchObject(url, queryDoctor(doctor));
    return responseSearchContact;
  } catch (error) {
    return error.message;
  }
};

module.exports = { searchContact };
