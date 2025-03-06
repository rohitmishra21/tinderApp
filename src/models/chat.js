const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
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
const chatSchema = mongoose.Schema({
  participate: {
    type: [mongoose.Schema.Types.ObjecctId],
    ref: "User",
    required: true,
  },
  message: [messageSchema],
});

const chatModel = mongoose.model("chat", chatSchema);

module.exports = chatModel;
