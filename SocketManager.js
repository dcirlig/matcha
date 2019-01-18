const io = require("./server.js").io;
var connection = require("./database/dbConnection");

module.exports = function (socket) {
  socket.on('room', (room) => {
    socket.join(room)
  })
  socket.on('MESSAGE_SENT', ({ chatRoom, message, fromUser, toUser, senderId, receiverId, sendAt, avatar, myAvatar }) => {
    io.to(chatRoom).emit('MESSAGE_SENT', { message, fromUser, toUser, sendAt, chatRoom, senderId, receiverId, avatar, myAvatar })
    const chatData = { senderId: senderId, receiverId: receiverId, content: message, time: sendAt, chatRoom: chatRoom, matchId: 9 }
    sql = "INSERT INTO messages SET ?";
    connection.query(sql, chatData, function (err, result) {
      if (err) console.log(err);
    })
    io.to(chatRoom).emit('MESSAGE_RECEIVED', { message, fromUser, toUser, sendAt, chatRoom, senderId, receiverId, avatar, myAvatar })
  })
}