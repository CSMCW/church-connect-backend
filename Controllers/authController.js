require("dotenv").config();
const createError = require("http-errors");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { authValidator } = require("../Schemas/authSchema");
const { supabaseClient } = require("../Config/supabaseConfig");

class AuthController {
  constructor(tablename) {
    this.tablename = tablename;
  }
  //signup controller
  async signup(req, res, next) {
    try {
      const { value: validatedResult, error: validationError } =
        authValidator.signupSchema.validate(req.body);

      if (validationError)
        throw new createError.UnprocessableEntity(
          `Cannot process your data, ${validationError.details[0].message}`
        );

      if (validatedResult) {
        console.log(this.tablename);
        res.end();
      }
      // else {
      //   throw new createError.InternalServerError(
      //     "Could not process your request at this time"
      //   );
      // }
    } catch (error) {
      next(error);
    }
  }

  //login controller
  async login(req, res) {
    try {
      res.send("login");
    } catch (error) {}
  }

  //logout controller
  async logout(req, res) {
    try {
      res.send("logout");
    } catch (error) {}
  }
}

const tablename = process.env.SUPABASE_TABLE_NAME;
const authController = new AuthController(tablename);
module.exports = { authController };
