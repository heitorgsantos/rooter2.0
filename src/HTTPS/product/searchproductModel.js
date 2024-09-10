const { searchObject, getPropertiesHS } = require("../../utils/functions");
const { queryProducts } = require("../../utils/querys");

const searchProducts = async (products) => {
  try {
    const url = "/crm/v3/objects/products/search";
    const responseSearchProducts = await searchObject(
      url,
      queryProducts(products)
    );
    return responseSearchProducts;
  } catch (error) {
    return { status: error.response.status, message: error.message };
  }
};
const searchProductsAssociates = async (id, object) => {
  try {
    const url = `/crm/v4/objects/line_items/${id}/associations/${object}`;
    const responseSearchProduct = await getPropertiesHS(url);
    return responseSearchProduct ? responseSearchProduct : false;
  } catch (error) {
    return error.message;
  }
};

module.exports = { searchProducts, searchProductsAssociates };
