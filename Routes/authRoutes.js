require('dotenv').config();
const { Router } = require('express');
const { authenticateToken } = require('../Utils/utilityFunctions');
const { signup, login, logout } = require('../Controllers/authController');
const authRoute = Router();

//handling the signup route
authRoute.post('/signup', signup);

//handling the login route
authRoute.post('/login', login);

//handling the logout route
authRoute.delete('/logout', authenticateToken, logout);

module.exports = { authRoute };
