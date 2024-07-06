const { Server } = require("socket.io");
const { pub, sub } = require("../service/redis");
class SocketService {
  #io;
  constructor() {
    console.log("Socket service init...");
    this.#io = new Server(); // Initializes a new instance of the Socket.io server
  }

  initListeners() {
    const io = this.io;
    console.log("Socket listeners init...");

    io.on("connection", (socket) => {
      console.log(
        `New user connected to the server with socket_id: ${socket.id}`
      );

      sub.subscribe("MESSAGES");
      socket.on("send:message", async (message) => {
        await pub.publish("MESSAGES", message);
      });

      sub.on("message", (channel, message) => {
        if (channel == "MESSAGES") {
          console.log(`${socket.id}: ${message}`);
          io.emit("message", message);
        }
      });

      socket.on("disconnect", (reason) => {
        console.log(`Disconnected socket_id: ${socket.id}, reason: ${reason}`);
        sub.unsubscribe("MESSAGES");
        sub.removeAllListeners("message");
      });
    });
  }
  get io() {
    return this.#io;
  }
}

module.exports = SocketService;
