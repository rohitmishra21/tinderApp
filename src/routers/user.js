const express = require("express");
const { userAuth } = require("../middleware/auth");
const RequestConnectionModel = require("../models/connectionRequest");
const userRoute = express.Router();
const User = require("../models/user");

const POPULATE_DATA = "firstName lastName profileImg gender age skills bio";

userRoute.get("/user/request/recived", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  const userRequest = await RequestConnectionModel.find({
    toUserId: loggedInUser._id,
    status: "intrested",
  }).populate("fromUserId", POPULATE_DATA);

  res.send(userRequest);
});

userRoute.get("/user/request/connection", userAuth, async (req, res) => {
  //accepted connctions
  try {
    const user = req.user;
    const connection = await RequestConnectionModel.find({
      $or: [
        { toUserId: user._id, status: "accepted" },
        { fromUserId: user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", POPULATE_DATA)
      .populate("toUserId", POPULATE_DATA);

    const data = connection.map((row) => {
      if (row.fromUserId._id.toString() === user._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRoute.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await RequestConnectionModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString()),
        hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(POPULATE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = userRoute;
