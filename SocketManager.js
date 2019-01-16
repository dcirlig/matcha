const io = require("./server.js").io;

module.exports = function (socket) {
  socket.on('room', (room) => {
    console.log(room)
    socket.join(room)
  })
  socket.on('MESSAGE_SENT', ({ chatRoom, message, fromUser, senderId, receiverId, sendAt }) => {
    const chatData = { senderId: senderId, receiverId: receiverId, time: sendAt, chatRoom: chatRoom, matchId: 0 }
    sql = "INSERT INTO chats SET ?";
    connection.query(sql, chatData, function (err, result) {
      if (err) console.log(err);
    });
    io.to(chatRoom).emit('MESSAGE_RECEIVED', { message, fromUser })
  })
}