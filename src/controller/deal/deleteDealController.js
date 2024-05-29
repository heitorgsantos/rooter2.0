const { deleteDealService } = require("../../service/deal/deleteDealService");

const deleteDealController = async (req, res) => {
  try {
    const responseDeleteDeal = await deleteDealService(req.body);
    return res.status(201).json(responseDeleteDeal);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
module.exports = { deleteDealController };
