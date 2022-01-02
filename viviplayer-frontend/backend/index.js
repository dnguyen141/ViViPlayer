const { httpServer } = require('socket.io');

const io = require('socket.io')(httpServer, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

io.listen(5001);

io.on('connection', (socket) => {
  console.log('MAKE CONNECT TO SOCKER', socket.id);
  socket.on('playVideo', () => {
    io.emit('getCommandToPlayVideo');
  });
  socket.on('pauseVideo', () => {
    io.emit('getCommandToPauseVideo');
  });
});
