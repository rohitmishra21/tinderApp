const mongoose = require("mongoose");

async function connect() {
  await mongoose.connect(
    "mongodb+srv://poadCast:nAP4Z7rtke1jylbR@tinder.o4otx.mongodb.net/Tinder"
  );
}

module.exports = connect;
