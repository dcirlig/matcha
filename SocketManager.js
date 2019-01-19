const io = require("./server.js").io;
const connection = require("./database/dbConnection");
const notification = require("./models/notification");
module.exports = function (socket) {
  socket.on("notif", likedUser => {
    socket.join(likedUser);
  });

  socket.on(
    "NOTIF_SENT",
    ({ likeroom, message, fromUser, senderId, receiverId, sendAt }) => {
      const notifData = {
        content: message,
        senderId,
        receiverId,
        time: sendAt
      };
      var count = 0;
      notification.createNotification(notifData);
      notification.countNotSeenNotification([receiverId, 0], function (result) {
        if (result) {
          result.forEach(element => {
            count = element.COUNT;
          });
        }
        console.log("count", count);
        io.to(likeroom).emit("NOTIF_RECEIVED", {
          fromUser,
          message,
          count
        });
      });
    }
  );

  socket.on("room", room => {
    console.log(room);
    socket.join(room);
  });

  socket.on('MESSAGE_SENT', ({ chatRoom, message, fromUser, toUser, senderId, receiverId, sendAt, avatar, myAvatar }) => {
    io.to(chatRoom).emit('MESSAGE_SENT', { message, fromUser, toUser, sendAt, chatRoom, senderId, receiverId, avatar, myAvatar })
    const chatData = { senderId: senderId, receiverId: receiverId, content: message, time: sendAt, chatRoom: chatRoom }
    sql = "INSERT INTO messages SET ?";
    connection.query(sql, chatData, function (err, result) {
      if (err) console.log(err);
    });
    io.to(chatRoom).emit('MESSAGE_RECEIVED', { message, fromUser, toUser, sendAt, chatRoom, senderId, receiverId, avatar, myAvatar })
  })
};