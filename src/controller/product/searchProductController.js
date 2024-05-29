const {
  searchProductService,
} = require("../../service/products/searchProductsService");

const searchProductController = async (req, res) => {
  const { produtos } = req.body;
  try {
    const responseSearchProduct = await searchProductService(produtos);
    return res.status(200).json(responseSearchProduct);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { searchProductController };
