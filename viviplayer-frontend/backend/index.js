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
  socket.on("playVideo", () => {
    io.emit("getCommandToPlayVideo");
  });
  socket.on("pauseVideo", () => {
    io.emit("getCommandToPauseVideo");
  });
  socket.on("jumpToChapter", (timeReceived) => {
    io.emit("getCommandToJumpChapter", timeReceived);
  });
});
console.log("Running 5000");
