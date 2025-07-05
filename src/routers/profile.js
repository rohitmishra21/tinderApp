const express = require("express");
const { userAuth } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { updateProfileValidation } = require("../utils/validation");
const profileRoute = express.Router();

profileRoute.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).send("please logIN");
  }
});

profileRoute.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!updateProfileValidation(req)) {
      throw new Error("this field will not be changed");
    }

    const loggedInUser = req.user;
    const { age } = req.body;

    // ✅ Age validation
    if (age && age < 18) {
      return res.status(400).json({ errors: ["Age must be at least 18."] });
    }

    // ✅ Update only allowed fields
    Object.keys(req.body).forEach((e) => {
      if (e in loggedInUser) {
        loggedInUser[e] = req.body[e];
      }
    });

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile is updated`,
      data: loggedInUser,
    });
  } catch (error) {
    console.log("Profile update error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ errors: [`${field} already exists.`] });
    }

    return res.status(500).json({ errors: ["Internal Server Error"] });
  }
});


profileRoute.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;
    const user = req.user;

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      throw new Error("Password is not valid");
    }

    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = profileRoute;
