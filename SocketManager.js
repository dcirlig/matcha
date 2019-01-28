const io = require("./server.js").io;
const connection = require("./database/dbConnection");
const notification = require("./models/notification");

const user = require("./models/user");
module.exports = function (socket) {
  socket.on("disconnect", async function () {
    sql = "UPDATE users SET ? WHERE socket_id=?";
    await connection.query(sql, [{ online: Date.now() }, socket.id], function (
      err,
      result
    ) {
      if (err) console.log(err);
    });

    io.emit("disconnect");
  });

  socket.on("onlineUser", async function (userId, socketId) {
    var data = { online: "online", socket_id: socketId };
    await user.updateUser(data, userId);
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
      var count = 0;
      notification.createNotification(notifData, function (data) {
        if (data) {
          count = count + 1;
          io.to(likeroom).emit("NOTIF_RECEIVED", {
            fromUser,
            message,
            count
          });
        }
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
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        content: check(message),
        time: sendAt,
        chatRoom: chatRoom
      };
      sql = "INSERT INTO messages SET ?";
      connection.query(sql, chatData, function (err, result) {
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

function check(message) {
  if (message) {
    if (
      !message
        .toString()
        .match(
          /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s:,;?.!()[\]"'/]+$/
        )
    ) {
      return "Use of forbidden characters in your message.";
    }
    if (message.length >= 140) {
      return message.slice(0, 139);
    }
    return message;
  } else {
    return "Empty message sent.";
  }
}
