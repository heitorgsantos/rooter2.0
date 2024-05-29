const { searchProducts } = require("../../model/product/searchproductModel");
const { updateProduct } = require("../../model/product/updateProductModel");

const updateProductService = async (products) => {
  console.log(products);
  const responseSearchProduct = await searchProducts(products);

  const newProducts = [];
  for (const product of products) {
    let productId;
    responseSearchProduct.forEach((item) => {
      if (product.sku_mais_pratico === item.properties.sku_mais_pratico) {
        productId = item.id;
        const productObject = {
          ...product,
          productId,
        };
        newProducts.push(productObject);
      }
    });
  }

    const responseUpdateProduct = await Promise.all(
        newProducts.map(async (product) => await updateProduct(product.productId, product))
    );
    return responseUpdateProduct;
};

module.exports = { updateProductService };
