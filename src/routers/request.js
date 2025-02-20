const express = require("express");
const { userAuth } = require("../middleware/auth");
const RequestConnectionModel = require("../models/connectionRequest");
const requestRoute = express.Router();
const User = require("../models/user");

requestRoute.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const user = req.user;
    const fromUserId = user._id;

    const validStatus = ["intrested", "ignored"];

    if (!validStatus.includes(status)) {
      throw new Error("invalid status type");
    }

    if (toUserId == fromUserId) {
      throw new Error("invalid request");
    }

    const toUser = await User.findById(toUserId);

    if (!toUser) {
      throw new Error("user is not present");
    }

    const isRequestExist = await RequestConnectionModel.findOne({
      $or: [
        { toUserId, fromUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (isRequestExist) {
      throw new Error("user is alredy in request");
    }

    const newUserConnection = await RequestConnectionModel({
      toUserId,
      fromUserId,
      status,
    });

    const requestedUSer = await newUserConnection.save();

    res.send(requestedUSer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = requestRoute;
