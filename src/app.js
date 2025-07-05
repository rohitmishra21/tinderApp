const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/auth");
const profileRoute = require("./routers/profile");
const requestRoute = require("./routers/request");
const userRoute = require("./routers/user");
const chat = require("./routers/chat");
const cors = require("cors");

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use("/", authRouter);
app.use("/", profileRoute);
app.use("/", requestRoute);
app.use("/", userRoute);
app.use("/", chat);

module.exports = app;
