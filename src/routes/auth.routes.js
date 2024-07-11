const { Router } = require("express");
const {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
} = require("../controllers/auth.controller");
const verifyToken = require("../middleware/auth.middleware");

const authRouter = Router();
authRouter.post("/signup", handleUserSignup);
authRouter.post("/login", handleUserLogin);
authRouter.post("/logout", verifyToken, handleUserLogout);

module.exports = authRouter;
