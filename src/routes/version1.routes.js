const { Router } = require("express");
const messageRouter = require("./message.routes");
//const authRouter = require("./auth.routes");

const v1Router = Router();
//v1Router.use("/auth", authRouter);
v1Router.use("/messages", messageRouter);
module.exports = v1Router;
