const { Router } = require("express");
const {
  handleSendMessages,
  handleReceiveMessages,
} = require("../controllers/message.controller");

const messageRouter = Router();

messageRouter.post(":/receiverId", handleSendMessages);
messageRouter.post("/:receiverId", handleReceiveMessages);

module.exports = messageRouter;
