const { Router } = require("express");
const {
  handleUserSignup,
  handleUserLogin,
} = require("../controllers/auth.controller");

const authRouter = Router();
authRouter.post("/signup", handleUserSignup);
authRouter.post("/login", handleUserLogin);

module.exports = authRouter;
