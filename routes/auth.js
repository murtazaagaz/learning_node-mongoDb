const express = require("express");
const router = express.Router();
const controller = require("../controller/auth");

router.get("/login", controller.getLogin);
router.post("/login", controller.postLogin);
router.get("/signup", controller.getSignUp);
router.post("/signup", controller.postSignUp);
router.post("/logout", controller.postLogout);
router.get("/reset-password", controller.getResetPassword);
router.post("/reset-password", controller.postResetPassword);
router.get("/reset/:token", controller.getNewPassword);
router.post("/new-password", controller.postNewPassword);

module.exports = router;
