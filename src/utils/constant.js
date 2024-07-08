const REDIS_THINGS = {
  host: process.env.AIVEN_REDIS_HOST,
  port: process.env.AIVEN_REDIS_PORT,
  username: process.env.AIVEN_REDIS_USER,
  password: process.env.AIVEN_REDIS_PASSWORD,
};
const KAFKA_TOPIC = "MESSAGES";

module.exports = { REDIS_THINGS, KAFKA_TOPIC };
