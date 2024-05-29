const { postPropertiesHS } = require("../../utils/functions");

const createProduct = async (data) => {
  const {
    price,
    nomeDoProduto,
    registro_anvisa,
    lote,
    valor_unitario,
    quantidade,
    fabricante,
    sku_mais_pratico,
    descricao,
  } = data;
  try {
    const url = "/crm/v3/objects/products/";
    const dataProducts = {
      properties: {
        price: price,
        name: nomeDoProduto,
        registro_anvisa: registro_anvisa,
        lote: lote,
        valor_unitario,
        quantidade,
        fabricante,
        sku_mais_pratico,
        description: descricao,
        hs_sku: sku_mais_pratico
      },
    };
    const responseCreateProduct = await postPropertiesHS(url, dataProducts);
    console.log(responseCreateProduct)
    return responseCreateProduct;
  } catch (error) {
    return { status: error.response.status, message: error.message };
  }
};

module.exports = { createProduct };
