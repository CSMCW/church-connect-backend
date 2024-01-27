require('dotenv').config();
const createError = require('http-errors');

const { authValidator } = require('../schemas/authSchema');

const {
  sendMessage,
  queryDatabase,
  insertIntoDatabase,
} = require('../utils/database');

const {
  encryptPassword,
  generateToken,
  isValidCredentials,
} = require('../utils/auth');

const { logWriter } = require('../utils/logger');
const { sendEmail } = require('../utils/sendEmail');

const signup = async (req, res, next) => {
  try {
    // validating users data from request body
    let { value: validatedResult, error: validationError } =
      authValidator.signupSchema.validate(req.body);

    if (validationError) {
      throw new createError.UnprocessableEntity(
        `Cannot process your data, ${validationError.details[0].message}`,
      );
    }

    // checking if username exists in the database
    const existingUsername = await queryDatabase(
      'users',
      'username',
      validatedResult.username,
    );

    //if username exist return error
    if (existingUsername.length > 0) {
      throw new createError.Conflict('username already exists!');
    }

    //checking if email exist in the database
    const existingEmail = await queryDatabase(
      'users',
      'email',
      validatedResult.email,
    );

    //if email exist return error.
    if (existingEmail.length > 0) {
      throw new createError.Conflict('email already exists!');
    }

    //encryting the password.
    validatedResult.password = await encryptPassword(validatedResult.password);

    // //storing new user inside the database.
    await insertIntoDatabase('users', validatedResult);

    //success message on saving the database
    sendMessage(res, 201, false, 'Created successfully');
  } catch (error) {
    logWriter('Error from signup controller.', 'errorsLogs.log');
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // validating users data from request body
    let { value: validatedResult, error: validationError } =
      authValidator.loginSchema.validate(req.body);

    if (validationError) {
      throw new createError.UnprocessableEntity(
        `Cannot process your data, ${validationError.details[0].message}`,
      );
    }

    //sending the access token to cookies after confirming credentials are valid
    if (
      await isValidCredentials(
        validatedResult.username,
        validatedResult.password,
      )
    ) {
      const payload = { username: validatedResult.username };
      const expiresIn = 30 * 24 * 60 * 60;
      const accessToken = generateToken(payload, expiresIn);
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      sendMessage(res, 200, false, 'Login success.');
    } else {
      throw new createError.Unauthorized('Unauthorized, invalid credentials');
    }
  } catch (error) {
    logWriter('Error from login controller', 'errorsLogs.log');
    next(error);
  }
};

//logout controller
const logout = async (req, res, next) => {
  try {
    //clearing access token from cookie.
    res.clearCookie('access_token');
    sendMessage(res, 204, false, 'logged out.');
  } catch (error) {
    logWriter('Error from logout controller', 'errorsLogs.log');
    next(error);
  }
};

// forgot password routes handling.. send reset password link to the user.
const forgotPassword = async (req, res, next) => {
  try {
    //validating req.body
    let { value: validatedResult, error: validationError } =
      authValidator.forgotPasswordSchema.validate(req.body);

    if (validationError) {
      throw new createError.UnprocessableEntity(
        `Cannot process your data, ${validationError.details[0].message}`,
      );
    }

    //checking if email exist on database
    const existingUser = await queryDatabase(
      'users',
      'email',
      validatedResult.email,
    );

    //if email exist, proceed with sending mail else return error.
    if (existingUser.length > 0) {
      const payload = { username: validatedResult.username };
      const expiresIn = 15 * 60 * 60;
      const resetToken = generateToken(payload, expiresIn);
      const reseturl = `${req.protocol}://${req.get(
        'host',
      )}/auth/resetPassword/${resetToken}`;
      const mailOptions = {
        reciever: `${existingUser.email}`,
        name: `${existingUser.firstname}`,
        subject: 'Password Reset',
        reason: 'we recieved a password reset request on your account.',
        action: {
          instructions: 'Click the button below to reset your password:',
          button: {
            color: '#22BC66',
            text: 'Confirm your account',
            link: reseturl,
          },
        },
        outro:
          'If you did not request a password request, kindly ignore this email.',
      };
      const sentEmail = await sendEmail(mailOptions);
      if (sentEmail)
        sendMessage(res, 204, false, 'you should recieve an email');
      else {
        logWriter('Error sending email: ', 'errorsLogs.log');
        throw new createError.InternalServerError();
      }
    } else {
      throw new createError.Unauthorized('Unauthorized, email does not exist');
    }
  } catch (error) {
    logWriter('Error from forgot password controller', 'errorsLogs.log');
    next(error);
  }
};

const resetPassword = async () => {};

module.exports = { signup, login, forgotPassword, resetPassword, logout };
