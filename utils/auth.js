require('dotenv').config();
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { queryDatabase } = require('./database');

const encryptPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    if (!hash) {
      console.log('Password is not hashed...');
      throw new createError.InternalServerError();
    }
    return hash;
  } catch (error) {
    console.error('Error from encryptPassword:', error.message);
    throw error;
  }
};

const generateAccessToken = (payload, expiresIn) => {
  try {
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign(payload, tokenSecret, { expiresIn });
    return token;
  } catch (error) {
    console.log('Error from generateAccessToken', error.message);
    throw error;
  }
};

//token authentication middleware for protected routes
const authenticateToken = (req, res, next) => {
  const token = req.cookies.access_token;
  const tokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (token == null) throw new createError.BadRequest();

  jwt.verify(token, tokenSecret, (err, user) => {
    if (err) throw new createError.Unauthorized();
    req.username = user.username;
    next();
  });
};

const isValidCredentials = async (username, password) => {
  //checking if the user is in the database
  try {
    const existingUser = await queryDatabase('users', 'username', username);

    if (existingUser.length > 0) {
      const validPassword = await bcrypt.compare(
        password,
        existingUser[0].password,
      );
      if (validPassword) {
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error('Error from isValidCredentials', error.message);
    throw error;
  }
};

module.exports = {
  encryptPassword,
  generateAccessToken,
  authenticateToken,
  isValidCredentials,
};
