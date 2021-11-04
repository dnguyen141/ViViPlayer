const { httpServer } = require("socket.io");

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://192.168.2.143:3000",
    methods: ["GET", "POST"],
  },
});

io.listen(5000);

io.on("connection", (socket) => {
  console.log("MAKE CONNECT TO SOCKER", socket.id);
  socket.on("sendCode", (code) => {
    console.log(code);
    // callback();
    io.emit("codeTransaction", code + "HAHAHA");
  });
  socket.on("playVideo", () => {
    io.emit("getCommandToPlayVideo");
  });
  socket.on("pauseVideo", () => {
    io.emit("getCommandToPauseVideo");
  });
});
console.log("Running 5000");
