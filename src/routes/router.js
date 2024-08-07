const express = require("express");
const {
  createDealController,
} = require("../controller/deal/createDealController");
const {
  updateDealController,
} = require("../controller/deal/updateDealController");
const {
  deleteDealController,
} = require("../controller/deal/deleteDealController");
const { getDealController } = require("../controller/deal/getDeallController");
const {
  createProductController,
} = require("../controller/product/createProductController");
const {
  updateProductController,
} = require("../controller/product/updateProductController");
const {
  deleteProductController,
} = require("../controller/product/deleteDealController");
const {
  searchProductController,
} = require("../controller/product/searchProductController");
const {
  updateValueDealController,
} = require("../controller/deal/updateValueDealController");

const router = express.Router();

router.post("/create-deal", createDealController);
router.post("/update-deal", updateDealController);
router.post("/update-value", updateValueDealController);
router.delete("/delete-deal", deleteDealController);
router.get("/get-deal", getDealController);

/**Produtsos */

router.post("/create-product", createProductController);
router.patch("/update-product", updateProductController);
router.get("/get-product", searchProductController);
router.delete("/delete-product", deleteProductController);

module.exports = { router };
