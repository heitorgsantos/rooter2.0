const { updateValueDealService } = require("../../service/deal/updateValueDealService");


const updateValueDealController = async (req, res) => {
  try {
    console.log(req.body)
    const responseUpdateValueDealService = await updateValueDealService(req.body);
    return res.status(201).json(responseUpdateValueDealService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { updateValueDealController };
