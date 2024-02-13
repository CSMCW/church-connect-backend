require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const helpers = require('./utils/helpers');
const authRoute = require('./routes/authRoutes');
const districtRoute = require('./routes/districtRoutes');
const swaggerDocs = require('./swagger');

// creating an app instance.
const app = express();

//setting middlewares that works before response is sent.
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//request logger middleware.
app.use(helpers.requestLogger);

//port is an environment variable or 6244.
const PORT = process.env.PORT || 6244;

//handling home route
app.get('/', (req, res) => {
  const messageOptions = {
    statusCode: 200,
    msgContent: 'Welcome to Church connect backend Api',
  };
  helpers.sendMessage(res, messageOptions);
});

//health check when deployed
app.get('/health', (req, res) => {
  return res.status(200).end();
});

//handling all routes with /auth/...
app.use('/v1/api/auth', authRoute);

//handling all routes with /districts/...
app.use('/v1/api/districts', districtRoute);

//handling documentation route.
const swaggerOptions = swaggerJsdoc(swaggerDocs);
app.use(
  '/v1/api/documentations',
  swaggerUi.serve,
  swaggerUi.setup(swaggerOptions),
);

//handling not found routes
app.use((req, res, next) => {
  next(
    new createError.NotFound(
      'The page is not found or the http method is not supported!',
    ),
  );
});

//error handler
app.use(helpers.errorHandler);

//starting the server
app.listen(PORT, () => {
  console.log(`Server listening...`);
});
