const { Server } = require("socket.io");
const { redis, sub } = require("../service/redis");
const http = require("http");
const express = require("express");
const { REDIS_CHANNEL } = require("../utils/constant");
const { channel } = require("diagnostics_channel");

const app = express();

const server = http.createServer(app);
const io = new Server(server);

const getSocketId = async (userId) => {
  return await redis.get(`userSocketMap:${userId}`);
};

// subscribing to REDIS message channel on server start
sub.subscribe(REDIS_CHANNEL);
sub.on("message", async (channel, receivedMessage) => {
  if (channel === REDIS_CHANNEL) {
    const { receiverId, senderId, message } = JSON.parse(receivedMessage);
    console.log(
      `receiverId: ${receiverId}, senderId: ${senderId}, message: ${message}`
    );
    const senderSocketId = await getSocketId(senderId);
    const receiverSocketId = await getSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }
    io.to(senderSocketId).emit("newMessage", message);
  }
});

io.on("connection", async (socket) => {
  console.log(`New user connected to the server with socket_id: ${socket.id}`);
  const cookies = socket.handshake.headers.cookie.split(";");
  let userId;
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "userId") {
      userId = value;
      break;
    }
  }
  await redis.set(`userSocketMap:${userId}`, socket.id);
  console.log(userId);

  socket.on("disconnect", async () => {
    console.log("user disconnected", socket.id);
    await redis.del(`userSocketMap:${userId}`);
  });
});

module.exports = { server, io, app, getSocketId };
