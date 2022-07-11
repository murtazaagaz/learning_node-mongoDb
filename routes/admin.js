const express = require("express");

const router = express.Router();
const adminController = require("../controller/admin");
const isAuth = require("../middlewares/is-auth");

// /admin/add-product => GET
router.use(isAuth);
router.get("/products", adminController.getProducts);

router.get("/add-product", adminController.getAddProductsController);

// admin/add-product => POST
router.post("/add-product", adminController.addProductController);

router.get(
  "/edit-product/:productId",
  adminController.getEditProductsController
);

router.post("/edit-product", adminController.postEditingController);

router.post("/delete-product", adminController.postDeleteProduct);

// // /admin/products
// router.get('/products', adminController.products);

module.exports = router;
