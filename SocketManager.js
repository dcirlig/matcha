const io = require("./server.js").io;
const connection = require("./database/dbConnection");
const notification = require("./models/notification");
const user = require("./models/user");
module.exports = function(socket) {
  socket.on("disconnect", function() {
    sql = "UPDATE users SET ? WHERE socket_id=?";
    connection.query(sql, [{ online: Date.now() }, socket.id], function(
      err,
      result
    ) {
      if (err) console.log(err);
    });

    io.emit("disconnect");
  });

  socket.on("onlineUser", function(userId, socketId) {
    var data = { online: "online", socket_id: socketId };
    user.updateUser(data, userId);
  });

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

      notification.createNotification(notifData);
      io.to(likeroom).emit("NOTIF_RECEIVED", {
        fromUser,
        message
      });
    }
  );

  socket.on("room", room => {
    socket.join(room);
  });

  socket.on(
    "MESSAGE_SENT",
    ({
      chatRoom,
      message,
      fromUser,
      toUser,
      senderId,
      receiverId,
      sendAt,
      avatar,
      myAvatar
    }) => {
      io.to(chatRoom).emit("MESSAGE_SENT", {
        message,
        fromUser,
        toUser,
        sendAt,
        chatRoom,
        senderId,
        receiverId,
        avatar,
        myAvatar
      });
      const chatData = {
        senderId: senderId,
        receiverId: receiverId,
        content: message,
        time: sendAt,
        chatRoom: chatRoom
      };
      sql = "INSERT INTO messages SET ?";
      connection.query(sql, chatData, function(err, result) {
        if (err) console.log(err);
      });
      io.to(chatRoom).emit("MESSAGE_RECEIVED", {
        message,
        fromUser,
        toUser,
        sendAt,
        chatRoom,
        senderId,
        receiverId,
        avatar,
        myAvatar
      });
    }
  );
};
