const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  participate: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  message: [messageSchema],
});

const chatModel = new mongoose.model("chat", chatSchema);

module.exports = chatModel;
