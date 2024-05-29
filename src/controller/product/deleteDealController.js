const { deleteProductService } = require("../../service/products/deleteProductService");

const deleteProductController = async (req, res) => {
  const { produtos } = req.body;
  console.log(produtos)
  try {
    const responseProductDelete = await deleteProductService(produtos);
    return res.status(201).json(responseProductDelete);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { deleteProductController };
