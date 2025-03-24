import { Server } from "socket.io";
import http from "http";
import express from "express";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export const getReceiverSocketId = (userId) => {
  return userSocketMap[String(userId)];
};

export const userSocketMap = {};
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
