const { deletePropertiesHS } = require("../../utils/functions");

const deleteProduct = async (id) => {
    try {
      const url = `/crm/v3/objects/products/${id}`;
      const responseDeleteProduct = await deletePropertiesHS(url);
      return responseDeleteProduct;
    } catch (error) {
      return { status: error.resonse.status, message: error.message };
    }
  };
  
  module.exports = { deleteProduct };