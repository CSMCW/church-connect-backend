require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { sendMessage } = require("./utils/utilityFunctions");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(201).json({
    error: false,
    message: "Welcome to Church connect backend Api.",
  });
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
