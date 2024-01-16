require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { sendMessage } = require("./utils/utilityFunctions");
// const { supabaseClient } = require("./config/supabaseConfig");
const { authRoute } = require("./routes/authRoutes");

const app = express();
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
