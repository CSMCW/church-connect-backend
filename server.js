require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const createError = require("http-errors");
const { sendMessage } = require("./Utils/utilityFunctions");
const { authRoute } = require("./Routes/authRoutes");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  sendMessage(res, 200, false, "Welcome to Church connect backend Api");
});

app.use("/auth", authRoute);

app.use((req, res, next) => {
  sendMessage(res, 404, true, "This route is unavailable!");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
