const { createProductService } = require("../../service/products/createProductService");

const createProductController = async (req, res) => {
  const { produtos } = req.body;
  try {
    const responseProductCreate = await createProductService(produtos);
    return res.status(201).json(responseProductCreate);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { createProductController };
