const { createProduct } = require("../../model/product/createProductModel");

const createProductService = async (products) => {
  const responseCreteProduct = await Promise.all(
    products.map(async (product) => await createProduct(product))
  );
  return responseCreteProduct;
};

module.exports = { createProductService };
