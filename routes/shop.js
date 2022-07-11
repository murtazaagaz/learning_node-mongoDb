const express = require("express");

const shopController = require("../controller/shop");
const isAuth = require("../middlewares/is-auth");
const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.use(isAuth);
router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/cart-delete-item", shopController.deleteCart);

router.get("/checkout", shopController.getCheckout);

router.post("/create-order", shopController.createOrder);

router.get("/orders", shopController.getOrders);

module.exports = router;
