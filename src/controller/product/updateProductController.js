const { updateProductService } = require("../../service/products/updateProductService");

const updateProductController = async (req, res) => {
    const { produtos } = req.body;
    try {
      const responseProductUpdate = await updateProductService(produtos);
      return res.status(201).json(responseProductUpdate);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
  
  module.exports = { updateProductController };
  