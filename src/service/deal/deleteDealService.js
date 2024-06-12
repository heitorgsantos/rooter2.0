const { deleteDeal } = require("../../model/deal/deleteDealModel");
const { searchDeal } = require("../../model/deal/searchDealModel");

const deleteDealService = async (negocio) => {
  try {
    const responseSearchDeal = await searchDeal(negocio);
    console.log(responseSearchDeal);

    const responseDeleteDeal = await deleteDeal(responseSearchDeal[0].id);
    if (responseDeleteDeal) {
      return "Negócio Deletado com sucesso!";
    }
    return "Negócio Deletado com sucesso!";
  } catch (error) {
    return { status: error.response.status, message: error.message };
  }
};
module.exports = { deleteDealService };
