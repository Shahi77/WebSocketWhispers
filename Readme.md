# WebSocketWhispers

A scalable chat application utilizing the power of Kafka for message streaming, Redis for caching, PostgreSQL for persistent storage, and WebSockets for real-time communication, and ensuring a seamless and responsive chatting experience.

### Start Zookeper Container and expose PORT `2181`

```bash
docker run -p 2181:2181 zookeeper
```

### Start Kafka Container, expose PORT `9092` and setup ENV variables

```bash
docker run -p 9092:9092 \
-e KAFKA_ZOOKEEPER_CONNECT=<PRIVATE_IP>:2181 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://<PRIVATE_IP>:9092 \
-e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
confluentinc/cp-kafka
```

### Server on PORT 8000

```bash
npm start or npm run dev
```
