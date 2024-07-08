const { Server } = require("socket.io");
const { pub, sub } = require("../service/redis");
const { produceMessage } = require("./kafka/producer");
class SocketService {
  #io;
  constructor() {
    console.log("Socket service init...");
    this.#io = new Server(); // Initializes a new instance of the Socket.io server
  }

  initListeners() {
    const io = this.io;
    console.log("Socket listeners init...");

    io.on("connection", async (socket) => {
      console.log(
        `New user connected to the server with socket_id: ${socket.id}`
      );

      await sub.subscribe("MESSAGES");
      socket.on("send:message", async (message) => {
        await pub.publish("MESSAGES", message);
      });

      sub.on("message", async (channel, message) => {
        if (channel == "MESSAGES") {
          console.log(`${socket.id}: ${message}`);
          io.emit("message", message);
          await produceMessage(message);
        }
      });

      socket.on("disconnect", async (reason) => {
        console.log(`Disconnected socket_id: ${socket.id}, reason: ${reason}`);
        await sub.unsubscribe("MESSAGES");
        await sub.removeAllListeners("message");
      });
    });
  }
  get io() {
    return this.#io;
  }
}

module.exports = SocketService;
