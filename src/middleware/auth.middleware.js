const prisma = require("../service/prisma");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const path = require("path");

const verifyToken = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");

  if (!accessToken) {
    return res.status(401).sendFile(path.resolve("./public/auth/index.html"));
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    return res.status(401).sendFile(path.resolve("./public/auth/index.html"));
  }
  const user = await prisma.user.findUnique({
    where: { id: decodedToken.id },
    select: {
      id: true,
      username: true,
      createdAt: true,
      updatedAt: true,
      password: false,
      refreshToken: false,
    },
  });

  if (!user) {
    return res.status(401).sendFile(path.resolve("./public/auth/index.html"));
  }

  req.user = user;
  next();
});

module.exports = verifyToken;
