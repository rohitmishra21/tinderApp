const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/auth");
const profileRoute = require("./routers/profile");
const requestRoute = require("./routers/request");

app.use(cookieParser());
app.use(express.json());
app.use("/", authRouter);
app.use("/", profileRoute);
app.use("/", requestRoute);

module.exports = app;
