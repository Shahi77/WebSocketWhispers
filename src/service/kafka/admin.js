const { KAFKA_TOPIC } = require("../../utils/constant");
const kafka = require("./client");

const init = async () => {
  try {
    const admin = kafka.admin();
    admin.connect();
    await admin.createTopics({
      topics: [
        {
          topic: KAFKA_TOPIC,
          numPartitions: 1,
        },
      ],
    });
    await admin.disconnect();
  } catch (error) {
    console.log(`Error creating kafka admin: ${error}`);
  }
};

init();
