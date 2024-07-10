const asyncHandler = require("../utils/asyncHandler");
const prisma = require("../service/prisma");
const { generateToken } = require("../utils/jwt");
const { hashPassword } = require("../utils/bcrypt");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { AUTH_COOKIE_OPTIONS } = require("../config/cookies.config");

const generateTokens = async (userId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const generateAccessToken = generateToken(userId, true);
    const generateRefreshToken = generateToken(userId, false);

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: generateRefreshToken },
    });

    return { generateAccessToken, generateRefreshToken };
  } catch (error) {
    throw new ApiError(500, "Error while generating tokens", error);
  }
};

const handleUserSignup = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if ([username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Username and Password are required fields");
  }
  const hashedPassword = await hashPassword(password);

  const existingUser = await prisma.user.findUnique({
    where: { username: username },
  });

  if (existingUser) {
    throw new ApiError(409, "User with entered username already exists");
  }

  const user = await prisma.user.create({
    data: { username: username, password: hashedPassword, refreshToken: "" },
    select: {
      id: true,
      username: true,
      createdAt: true,
      updatedAt: true,
      password: false,
      refreshToken: false,
    },
  });

  const { generatedAccessToken, generatedRefreshToken } = await generateTokens(
    user.id
  );

  return res
    .status(201)
    .cookie("accessToken", generatedAccessToken, AUTH_COOKIE_OPTIONS)
    .cookie("refreshToken", generatedRefreshToken, AUTH_COOKIE_OPTIONS)
    .json(new ApiResponse(201, { user: user }, "user created successfully"));
});

module.exports = { handleUserSignup };
