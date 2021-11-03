const { Server } = require("socket.io");

const io = new Server({
  /* options */
});

io.on("connection", (socket) => {
  console.log("Socket connection");
});

io.listen(5000);
