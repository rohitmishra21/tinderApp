const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    const decodedMsg = await jwt.verify(token, "devTinder101");

    if (!decodedMsg) {
      throw new Error("invalid token");
    }

    const { _id } = decodedMsg;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user is not present");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).send("ERROR :" + error.message);
  }
};

module.exports = { userAuth };
