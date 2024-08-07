const { createProduct } = require("../model/product/createProductModel");

const analyseProdutcts = async (productsInHs, productsPayload) => {
  if (productsInHs.length !== productsPayload.length) {
    // console.log("Não éo mesmo tamnaho");
    let productsToCreate = [];
    productsInHs.forEach((inHs) => {
      productsPayload.forEach((payload) => {
        if (inHs.properties.hs_sku !== payload.sku_mais_pratico) {
          productsToCreate.push(payload);
        } else {
          inHs.properties.quantity = payload.quantidade;
        }
      });
    });
    // console.log("Produtos a ser criados", productsToCreate);
    for (const product of productsToCreate) {
      const newProducts = await createProduct(product);
      existingProducts.push(newProducts);
    }
    // console.log("Produto criados", existingProducts);
  } else {
    productsInHs.forEach((inHs) => {
      productsPayload.forEach((payload) => {
        if (inHs.properties.hs_sku === payload.sku_mais_pratico) {
          inHs.properties.quantity = payload.quantidade;
        }
      });
    });
  }
};

const formatCreateLineItems = (allProducts, dealId) => {
  // console.log(allProducts)
  const { quantity, quantidade, price, hs_object_id, name, sku_mais_pratico } =
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
