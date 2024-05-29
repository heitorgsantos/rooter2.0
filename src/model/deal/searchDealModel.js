const { searchObject, getPropertiesHS } = require("../../utils/functions");
const { queryDeal, queryDealStage, queryDealId } = require("../../utils/querys");

const searchDeal = async (negocio) => {
  try {
    const url = "/crm/v3/objects/deals/search";

    const responseSearchDeal = await searchObject(url, queryDeal(negocio));
    return responseSearchDeal.length > 0 ? responseSearchDeal : false;
  } catch (error) {
    return error.message;
  }
};

const searchDealAssociates = async (id, object) => {
  try {
    const url = `/crm/v3/objects/deals/${id}/associations/${object}`;

    const responseSearchDeal = await getPropertiesHS(url);
    return responseSearchDeal ? responseSearchDeal : false;
  } catch (error) {
    return error.message;
  }
};

const getDealStage = async (dealstage) => {
  const url = `crm/v3/objects/deal/search`;
  const responseGetDeal = await searchObject(url, queryDealStage(dealstage));
  return responseGetDeal
};

const getDealId = async (id) => {
  const url = `crm/v3/objects/deal/search`;
  const responseGetDeal = await searchObject(url, queryDealId(id));
  return responseGetDeal
};

module.exports = { searchDeal, searchDealAssociates, getDealStage, getDealId };
