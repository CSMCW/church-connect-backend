const { Router } = require("express");
const { authController } = require("../Controllers/authController");
const authRoute = Router();

//handling the signup route
authRoute.post("/signup", authController.signup);
//handling the login route
authRoute.post("/login", authController.login);
//handling the logout route
authRoute.delete("/logout", authController.logout);

module.exports = { authRoute };
