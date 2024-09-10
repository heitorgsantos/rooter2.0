const { createProduct } = require("../HTTPS/product/createProductModel");

const analyseProdutcts = async (productsInHs, productsPayload) => {
  let productsToCreate = [];
  let updatedProducts = [];

  productsPayload.forEach((payload) => {
    const existingProduct = productsInHs.find(
      (inHs) => inHs.properties.hs_sku === payload.sku_mais_pratico
    );

    if (existingProduct) {
      existingProduct.properties.quantity = payload.quantidade;
      updatedProducts.push(existingProduct);
    } else {
      productsToCreate.push(payload);
    }
  });

  if (productsToCreate.length > 0) {
    const newProducts = await Promise.all(
      productsToCreate.map((product) => createProduct(product))
    );
    updatedProducts = [...updatedProducts, ...newProducts];
  }

  return updatedProducts;
};

const formatCreateLineItems = (allProducts, dealId) => {
  // console.log(allProducts)
  const { quantity, quantidade, hs_object_id, name, sku_mais_pratico, price } =
    allProducts.properties;

  const dataAssociates = {
    properties: {
      quantity:
        quantity !== undefined && quantity !== null ? quantity : quantidade,
      price,
      hs_product_id: hs_object_id,
      name,
      sku_mais_pratico,
    },
    associations: [
      {
        to: {
          id: dealId.id,
        },
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 20,
          },
        ],
      },
    ],
  };
  return dataAssociates;
};

module.exports = { analyseProdutcts, formatCreateLineItems };
