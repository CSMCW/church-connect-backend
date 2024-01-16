const { Router } = require("express");
const { authController } = require("../Controllers/authController");
const authRoute = Router();

authRoute.post("/signup", authController.signup);
authRoute.post("/login", authController.login);
authRoute.delete("/logout", authController.logout);

module.exports = { authRoute };
