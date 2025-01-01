const Redis = require("ioredis");
const { REDIS_THINGS } = require("../config/redis.config");

const pub = new Redis(process.env.AIVEN_REDIS_URI);
const sub = new Redis(process.env.AIVEN_REDIS_URI);
const redis = new Redis(process.env.AIVEN_REDIS_URI);

module.exports = { pub, sub, redis };
