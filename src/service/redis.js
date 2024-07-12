const Redis = require("ioredis");
const { REDIS_THINGS } = require("../config/redis.config");

const pub = new Redis(REDIS_THINGS);
const sub = new Redis(REDIS_THINGS);
const redis = new Redis(REDIS_THINGS);

module.exports = { pub, sub, redis };
