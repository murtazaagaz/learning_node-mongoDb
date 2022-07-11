const express = require("express");

const router = express.Router();
const controller = require("../controller/auth");
router.get("/login", controller.getLogin);
router.post("/login", controller.postLogin);
router.get("/signup", controller.getSignUp);
router.post("/signup", controller.postSignUp);
router.post("/logout", controller.postLogout);

module.exports = router;
