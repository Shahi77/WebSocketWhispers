const { Router } = require("express");
const authRouter = require("./auth.routes");

const v1Router = Router();
v1Router.post("/auth", authRouter);

module.exports = v1Router;
