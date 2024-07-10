const { Router } = require("express");
const { handleUserSignup } = require("../controllers/auth.controller");

const authRouter = Router();
authRouter.post("/signup", handleUserSignup);

module.exports = authRouter;