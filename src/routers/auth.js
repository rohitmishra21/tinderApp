const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();


authRouter.post("/signUp", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ errors: ["All fields are required."] });
    }

    const existingUser = await User.findOne({ email });
    const existingFirstName = await User.findOne({ firstName });
    
    if (existingFirstName) {
      return res.status(400).json({ errors: ["First name already exists."] });
    }

    if (existingUser) {
      return res.status(400).json({ errors: ["Username already exists."] });
    }



    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    const newUser = await user.save();

    const token = jwt.sign({ _id: newUser._id }, "devTinder101");
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }

    console.error("Signup Error:", error);
    res.status(500).json({ errors: ["Internal Server Error"] });
  }
});


authRouter.post("/signIn", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ errors: ["Email and password are required."] });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ errors: ["Invalid credentials."] });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ errors: ["Invalid credentials."] });
    }

    const token = jwt.sign({ _id: user._id }, "devTinder101");
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json(user);
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ errors: ["Internal Server Error"] });
  }
});


authRouter.post("/signOut", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
  res.status(200).json({ message: "User signed out successfully." });
});

module.exports = authRouter;
