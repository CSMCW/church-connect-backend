const { Router } = require("express");
const { authController } = require("../controllers/authController");
const authRoute = Router();

authRoute.post("/signup", authController.signup);
authRoute.post("/login", authController.login);
authRoute.post("/logout", authController.logout);

module.exports = { authRoute };
