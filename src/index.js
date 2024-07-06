const app = require("./app");
const http = require("http");
const SocketService = require("./service/socketServer");
require("dotenv").config();

const PORT = process.env.PORT || 9000;

const init = async () => {
  const socketService = new SocketService();
  const httpServer = http.createServer(app);
  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
  socketService.initListeners();
};

init();
