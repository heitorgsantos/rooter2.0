const { searchObject } = require("../../utils/functions");
const { queryCompany } = require("../../utils/querys");

const searchCompanie = async (empresa) => {
  try {
    const url = "/crm/v3/objects/companies/search";
    const responseSearchCompanie = await searchObject(
      url,
      queryCompany(empresa)
    );
    return responseSearchCompanie;
  } catch (error) {}
};

module.exports = { searchCompanie };
