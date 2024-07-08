const {  getDealStage, getDealId } = require("../../model/deal/searchDealModel");

const getDealService = async ({stage, dealId}) => {
    console.log("Aqui",stage, dealId)
    if(stage) {

        const responseGetDeal = await getDealStage(stage);
        return responseGetDeal
    } else if(dealId) {
        const responseGetDeal = await getDealId(dealId);
        return responseGetDeal
       
    }
};

module.exports = { getDealService };
