const { Server } = require("socket.io");
const http = require("http");

const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const getReceiverSocketId = (userId) => {
  return userSocketMap[String(userId)];
};

const userSocketMap = {};
io.on("connection", (socket) => {
  console.log("connected:", socket.id);
  const userId = socket.handshake.query.userid;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, app, server,getReceiverSocketId };
