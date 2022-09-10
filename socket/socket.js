const socket = require('socket.io')

module.exports = (server) => {
  const io = socket(server, {
    allowEIO3: true,
    cors: {
      origin: ['http://localhost:8080'],
      credentials: true
    },
  })

  io.on('connection', (socket) => {
    console.log('from frontend connecting...')

    socket.on('send', function (obj) {
      console.log(obj);

      socket.emit('other', {
        msg: 'other msg',
      });
      socket.emit('self', {
        msg: 'self msg',
      });
    });

  });
}