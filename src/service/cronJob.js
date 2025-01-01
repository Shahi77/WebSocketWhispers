const cron = require("node-cron");
const { redis } = require("./redis");

const startCronJobs = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log(
      "Cron job to clean up messages from Redis which are written on DB"
    );
    try {
      const keys = await redis.keys("messages:*");
      const now = Date.now();
      for (const key of keys) {
        await redis.zremrangebyscore(key, 0, now);
      }
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
};
module.exports = { startCronJobs };
