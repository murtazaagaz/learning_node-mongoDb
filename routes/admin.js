const express = require("express");

const router = express.Router();
const adminController = require("../controller/admin");
const isAuth = require("../middlewares/is-auth");

// /admin/add-product => GET
router.get("/products", isAuth, adminController.getProducts);

router.get("/add-product", isAuth, adminController.getAddProductsController);

// admin/add-product => POST
router.post("/add-product", isAuth, adminController.addProductController);

router.get(
  "/edit-product/:productId",
  isAuth,
  adminController.getEditProductsController
);

router.post("/edit-product", isAuth, adminController.postEditingController);

router.post("/delete", isAuth, adminController.postDeleteProduct);

// // /admin/products
// router.get('/products', adminController.products);

module.exports = router;
