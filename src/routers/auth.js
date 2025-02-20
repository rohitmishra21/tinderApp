const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
  try {
    const { firstName, lastName, email, gender, password, skills, age } =
      req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
      gender: gender,
      skills: skills,
      age: age,
    });

    await user.save();
    res.send("User created");
  } catch (error) {
    console.log(error);
    res.status(500).send("there is some essu " + error.message);
  }
});

authRouter.post("/signIn", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("invalid credential");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      const token = await jwt.sign({ _id: user._id }, "devTinder101");

      res.cookie("token", token);
      res.send("user signIn successfully...");
    } else {
      throw new Error("invalid credential");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("there is some essu " + error.message);
  }
});

authRouter.post("/signOut", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("user signOut successfully");
});
module.exports = authRouter;
