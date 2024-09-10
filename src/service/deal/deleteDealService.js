const { deleteDeal } = require("../../HTTPS/deal/deleteDealModel");
const { searchDeal } = require("../../HTTPS/deal/searchDealModel");

const deleteDealService = async (negocio) => {
  try {
    const responseSearchDeal = await searchDeal(negocio);
    console.log("Deal", responseSearchDeal);
    if (!responseSearchDeal) {
      return "Negócio não encontrado, verifique se está passando o ID corretamente!";
    }

    const responseDeleteDeal = await deleteDeal(responseSearchDeal[0].id);
    console.log("Response, delete Deal")
    if (responseDeleteDeal) {
      return {
        message: "Negócio Deletado com sucesso!",
        dealName: responseSearchDeal[0].properties.dealname,
        dealId: responseSearchDeal[0].id,
      };
    }
    return {
      message: "Negócio Deletado com sucesso!",
      dealName: responseSearchDeal[0].properties.dealname,
      dealId: responseSearchDeal[0].id,
    };
  } catch (error) {
    return { status: error.status, message: error.message };
  }
};
module.exports = { deleteDealService };
