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
const allowedOrigins = [
  "http://localhost:5173",
  "https://tinder-app-ui-wl3c.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/", authRouter);
app.use("/", profileRoute);
app.use("/", requestRoute);
app.use("/", userRoute);
app.use("/", chat);

module.exports = app;
