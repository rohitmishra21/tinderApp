const socket = require("socket.io");
const cors = require("cors");
const chatModel = require("../models/chat");
const intializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: " http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ userId, targetUserId, firstName, text }) => {
        const room = [userId, targetUserId].sort().join("_");
        try {
          let chat = await chatModel.findOne({
            participate: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new chat({
              participate: [userId, targetUserId],
              message: [],
            });
          }

          chat.message.push({ senderId: userId, text });
          
        } catch (error) {
          console.log(error.message);
        }
        io.to(room).emit("messageRecived", { firstName, text });
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = intializeSocket;
