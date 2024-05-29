const { getDealService } = require("../../service/deal/getDealService");

const getDealController = async (req, res) => {
  try {
    const {query} = req
    const responseGetDeal = await getDealService(query);
    return res.status(200).json(responseGetDeal);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { getDealController };
