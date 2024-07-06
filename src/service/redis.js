const Redis = require("ioredis");
const { REDIS_THINGS } = require("../utils/constant");

const pub = new Redis(REDIS_THINGS);
const sub = new Redis(REDIS_THINGS);

module.exports = { pub, sub };
