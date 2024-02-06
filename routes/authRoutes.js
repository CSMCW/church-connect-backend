require('dotenv').config();
const { Router } = require('express');
const { authenticateToken } = require('../utils/auth');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  logout,
} = require('../controllers/authController');
const authRoute = Router();

//handling the signup route
authRoute.post('/signup', signup);

//handling the login route
authRoute.post('/login', login);

//handling forgot password
authRoute.post('/forgotPassword', forgotPassword);

//handling password reset
authRoute.patch('/resetPassword/:token', resetPassword);

//handling the logout route
authRoute.delete('/logout', authenticateToken, logout);

module.exports = { authRoute };
