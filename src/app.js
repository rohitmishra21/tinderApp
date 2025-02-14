const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/auth");
const authRouter = require("./routers/auth");
app.use(cookieParser());
app.use(express.json());
app.use("/", authRouter);

module.exports = app;
