const { patchObjectsProperties } = require("../../utils/functions");

const updateProduct = async (id, data) => {
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
    const url = `/crm/v3/objects/products/${id}`;
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
        hs_sku: sku_mais_pratico,
      },
    };
    const responseUpdateProduct = await patchObjectsProperties(url, dataProducts);
    console.log(responseUpdateProduct);
    return responseUpdateProduct;
  } catch (error) {
    return { status: error.response.status, message: error.message };
  }
};

module.exports = { updateProduct };
