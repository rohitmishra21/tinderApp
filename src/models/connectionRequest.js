const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  status: {
    type: String,
    enum: {
      values: ["rejected", "intrested", "ignored", "accepted"],
      message: `{VAlUE} is not defined`,
    },
  },
});

const RequestConnectionModel = new mongoose.model(
  "connections",
  connectionSchema
);

module.exports = RequestConnectionModel;
