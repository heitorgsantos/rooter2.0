const { postPropertiesHS } = require("../../utils/functions");

const createDeal = async (deal) => {
  const url = "/crm/v3/objects/deals";
  try {
    const responseCreateDeal = await postPropertiesHS(url, deal);
    return responseCreateDeal;
  } catch (error) {
    return { status: error.response.status, message: error.message };
  }
};

module.exports = createDeal;
