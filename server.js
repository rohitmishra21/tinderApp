const app = require("./src/app");
const connect = require("./src/db/db");
const http = require('http');
const intializeSocket = require("./src/socket/socket");
const server = http.createServer(app)
require("dotenv").config();

intializeSocket(server)

connect()
  .then(() => {
    console.log("db connected");
    server.listen(process.env.PORT, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("db is not connected");
  });
