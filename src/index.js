const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const v1Router = require("./routes/version1.routes");
const { server, app } = require("./service/socketServer");
const verifyToken = require("./middleware/auth.middleware");
const { startCronJobs } = require("./service/cronJob");
require("dotenv").config();

const PORT = process.env.PORT || 8001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());

app.get("/", verifyToken, (req, res) => {
  res.sendFile(path.resolve("./public/chat/index.html"));
});

app.use("/v1", v1Router);

const init = async () => {
  startCronJobs();
  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

init();
