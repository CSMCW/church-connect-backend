require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const createError = require('http-errors');

const { sendMessage } = require('./utils/database');
const { authRoute } = require('./routes/authRoutes');
const { logWriter } = require('./utils/logger');

// creating an app instance
const app = express();

//setting middlewares that works before response is sent...
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const message = `${req.headers.origin}\t${req.method}\t${req.url}`;
  logWriter(message, 'requestsLog.log');
  next();
});

//port is an environment variable or 6244
const PORT = process.env.PORT || 6244;
//interface to run server
const INTERFACE = '192.168.43.11';

//handling home route
app.get('/', (req, res) => {
  sendMessage(res, 200, false, 'Welcome to Church connect backend Api');
});

//handling all routes with /auth..
app.use('/auth', authRoute);

//handling not found routes
app.use((req, res, next) => {
  next(new createError.NotFound('This page is unavailable!'));
});

//error handler
app.use((error, req, res, next) => {
  const message = `${error.name}:, ${error.message}`;

  logWriter(message, 'errorsLogs.log');

  sendMessage(res, error.statusCode || 500, true, error.message);
});

//starting the server
app.listen(PORT, INTERFACE, () => {
  console.log(`Server listening on ${PORT}`);
});
