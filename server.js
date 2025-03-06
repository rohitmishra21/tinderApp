const app = require("./src/app");
const connect = require("./src/db/db");
const http = require('http');
const intializeSocket = require("./src/socket/socket");
const server = http.createServer(app)

intializeSocket(server)

connect()
  .then(() => {
    console.log("db connected");
    server.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("db is not connected");
  });
