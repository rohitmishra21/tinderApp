const express = require("express");
const chatModel = require("../models/chat");
const { path } = require("../app");
const chatRouter = express.Router();

chatRouter.post("/chat", async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;
    const chat = await chatModel
      .findOne({
        participate: { $all: [userId, targetUserId] },
      })
      .populate({
        path: "message.senderId",
        select: "firstName lastName profileImg",
      });
    if (!chat) {
      chat = new chatModel({
        participate: { $all: [userId, targetUserId] },
        message: [],
      });
    }
    res.send(chat);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = chatRouter;
