const { Server } = require("socket.io");
const { redis, sub } = require("../service/redis");
const http = require("http");
const express = require("express");
const { REDIS_CHANNEL } = require("../utils/constant");
const { getSocketId } = require("../utils/socketManager");
const cookie = require("cookie");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Subscribing to REDIS message channel on server start
sub.subscribe(REDIS_CHANNEL);
sub.on("message", async (channel, receivedMessage) => {
  if (channel === REDIS_CHANNEL) {
    const { receiverId, senderId, message } = JSON.parse(receivedMessage);
    console.log(
      `receiverId: ${receiverId}, senderId: ${senderId}, message: ${message}`
    );

    try {
      const senderSocketId = await getSocketId(senderId);
      const receiverSocketId = await getSocketId(receiverId);

      if (receiverSocketId && receiverSocketId !== senderSocketId) {
        io.to(receiverSocketId).emit("newMessage", message);
      }
      io.to(senderSocketId).emit("newMessage", message);
    } catch (error) {
      console.error("Error processing message:", error.message);
    }
  }
});

io.on("connection", async (socket) => {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const userId = cookies.userId;
    if (!userId) throw new Error("User ID missing in cookies");

    await redis.set(`userSocketMap:${userId}`, socket.id, "EX", 3600);
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  } catch (error) {
    console.error("Error during socket connection:", error.message);
    socket.disconnect();
  }

  socket.on("disconnect", async () => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const userId = cookies.userId;
      console.log("User disconnected", socket.id);
      await redis.del(`userSocketMap:${userId}`);
    } catch (error) {
      console.error("Error during socket disconnect:", error.message);
    }
  });
});

module.exports = { server, io, app };
