const { updateDealService } = require("../../service/deal/updateDealService");

const updateDealController = async (req, res) => {
    try {
        const responseUpdateDeal = await updateDealService(req.body);
        return res.status(201).json(responseUpdateDeal);
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

module.exports = {updateDealController}