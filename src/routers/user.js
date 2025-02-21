const express = require("express");
const { userAuth } = require("../middleware/auth");
const RequestConnectionModel = require("../models/connectionRequest");
const userRoute = express.Router();

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

    const connectionRequest = await RequestConnectionModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new set();
    
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = userRoute;
