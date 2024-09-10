const { searchProducts } = require("../../HTTPS/product/searchproductModel");

const searchProductService = async (products) => {
  const responseSearchProducts = await searchProducts(products);
  return responseSearchProducts;
};

module.exports = { searchProductService };
