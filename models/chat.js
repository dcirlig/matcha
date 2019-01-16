var connection = require("../database/dbConnection");

function createChat(chatData) {
  sql = "INSERT INTO chats SET ?";
  connection.query(sql, chatData, function (err, result) {
    if (err) console.log(err);
  });
}

function getRooms(userId, callback) {
  sql = "SELECT chats.room, chats.userId1, chats.userId2, messages.chatRoom as existingChat, a.username as username1, b.username as username2 FROM chats LEFT JOIN messages ON chats.room = messages.chatRoom LEFT JOIN users a ON chats.userId1 = a.userId LEFT JOIN users b ON chats.userId2 = b.userId WHERE chats.userId1 = ? OR chats.userId2 = ?"
  connection.query(sql, [userId, userId], function (err, result) {
    if (err) console.log(err)
    if (result) callback(result)
    else if (!result) callback('Not found')
  })
}

// function getRooms(userId, callback) {
//   sql = "SELECT * FROM messages RIGHT JOIN chats ON chats.room = messages.chatRoom WHERE chats.userId1 = ? OR chats.userId2 = ?"
//   connection.query(sql, [userId, userId], function (err, result) {
//     if (err) console.log(err)
//     if (result) callback(result)
//     else if (!result) callback('Not found')
//   })
// }

// function getRooms(userId, callback) {
//   sql = "SELECT room, userId1, userId2 FROM `chats` WHERE `userId1` = ? OR `userId2` = ?"
//   connection.query(sql, [userId, userId], function (err, result) {
//     if (err) console.log(err)
//     callback(result)
//   })
// }

function getMessages(roomName, callback) {
  sql = "SELECT * FROM `messages` WHERE chatRoom = ?"
  connection.query(sql, roomName, function (err, result) {
    if (err) console.log(err)
    callback(result)
  })
}

exports.createChat = createChat
exports.getRooms = getRooms
exports.getMessages = getMessages;
