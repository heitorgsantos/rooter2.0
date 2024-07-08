const { deleteProduct } = require("../../model/product/deleteProductModel");
const { searchProducts } = require("../../model/product/searchproductModel");

const deleteProductService = async (products) => {
  const responseSearchProduct = await searchProducts(products);
console.log("Entrou no delete", products)
  let idProducts = [];
  for (const product of products) {
    idProducts = responseSearchProduct.map((item) => {
      console.log(item);
      if (product.sku_mais_pratico === item.properties.hs_sku) {
        return item.id;
      }
    });
  }
  console.log(idProducts);
  const responseUpdateProduct = await Promise.all(
    idProducts.map(async (product) => await deleteProduct(product))
  );
  return responseUpdateProduct ? "Excluido com sucesso" : "Erro ao excluir";
};

module.exports = { deleteProductService };
