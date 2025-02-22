const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/auth");
const profileRoute = require("./routers/profile");
const requestRoute = require("./routers/request");
const userRoute = require("./routers/user");
const cors = require("cors");

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: " http://localhost:5175",
    credentials: true,
  })
);
app.use("/", authRouter);
app.use("/", profileRoute);
app.use("/", requestRoute);
app.use("/", userRoute);

module.exports = app;
