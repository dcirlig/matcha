var connection = require("../database/dbConnection");

function createChat(chatData) {
  sql = "INSERT INTO chats SET ?";
  connection.query(sql, chatData, function (err, result) {
    if (err) console.log(err);
  });
}

function getRooms(userId, callback) {
  sql = "SELECT chats.room, chats.time, chats.userId1, chats.userId2, a.username as username1, a.profil_image as profil_image1, b.profil_image as profil_image2, b.username as username2 FROM chats LEFT JOIN users a ON chats.userId1 = a.userId LEFT JOIN users b ON chats.userId2 = b.userId WHERE chats.userId1 = ? OR chats.userId2 = ?"
  connection.query(sql, [userId, userId], function (err, result) {
    if (err) console.log(err)
    if (result) callback(result)
    else if (!result) callback('Not found')
  })
}

function getLastMessage(roomName, callback) {
  sql = "SELECT messages.content, messages.senderId, messages.time, users.username FROM messages INNER JOIN users ON messages.senderId = users.userId WHERE chatRoom = ? ORDER BY messageId DESC LIMIT 1"
  connection.query(sql, roomName, function (err, result) {
    if (err) console.log(err)
    else if (result) { callback(result) }
    else { callback("No last Message found") }
  })
}

function getMessages(roomName, callback) {
  sql = "SELECT messages.messageId, messages.senderId, messages.receiverId, messages.content, messages.time, messages.chatRoom, a.username as senderUsername, b.username as receiverUsername FROM messages INNER JOIN users a ON messages.senderId = a.userId INNER JOIN users b ON messages.receiverId = b.userId WHERE chatRoom = ?"
  connection.query(sql, roomName, function (err, result) {
    if (err) console.log(err)
    callback(result)
  })
}

function isChat(userId1, userId2, callback) {
  sql = "SELECT room as chatRoom FROM chats WHERE (userId1 = ? AND userId2 = ?) OR (userId2 = ? AND userId1 = ?)"
  connection.query(sql, [userId1, userId2, userId1, userId2], function (err, result) {
    if (err) console.log(err)
    callback(result)
  })
}

function deleteChat(chatRoom) {
  sql = "DELETE FROM `messages` WHERE chatRoom = ?"
  connection.query(sql, chatRoom, function (err, result) {
    if (err) {
      console.log(err)
      return false;
    }
  })
  sql = "DELETE FROM `chats` WHERE room = ?"
  connection.query(sql, chatRoom, function (err, result) {
    if (err) {
      console.log(err)
      return false;
    }
  })
  return true;
}

exports.createChat = createChat
exports.getRooms = getRooms
exports.getMessages = getMessages;
exports.getLastMessage = getLastMessage;
exports.isChat = isChat;
exports.deleteChat = deleteChat;
