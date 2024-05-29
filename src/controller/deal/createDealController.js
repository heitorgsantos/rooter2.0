const {
  requestModelCreateDeal,
} = require("../../service/deal/createDealService");

const createDealController = async (req, res) => {
  try {
    const responseServiceCreateDeal = await requestModelCreateDeal(req.body);
    return res.status(201).json(responseServiceCreateDeal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createDealController };
