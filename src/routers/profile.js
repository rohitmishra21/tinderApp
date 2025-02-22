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
      throw new Error("this filed will not be chnge");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((e) => (loggedInUser[e] = req.body[e]));

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName},your profile is updated`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send(error.message);
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
