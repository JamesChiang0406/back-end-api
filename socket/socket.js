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

    // 打開聊天室時，同時通知對方
    socket.on('chatAlert', (obj) => {
      socket.broadcast.emit('openOthersRoom', obj)
    })

    // 發送訊息
    socket.on('send', (obj) => {
      socket.broadcast.emit('receiveMsg', obj)
    });
  });
}