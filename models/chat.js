var connection = require("../database/dbConnection");

function createChat(chatData) {
  sql = "INSERT INTO chats SET ?";
  connection.query(sql, chatData, function (err, result) {
    if (err) console.log(err);
  });
}

function getRooms(userId, callback) {
  sql = "SELECT room FROM likes WHERE likeTransmitter = ?"
  connection.query(sql, userId, function (err, result) {
    if (err) console.log(err)
    callback(result);
  })
}

exports.createChat = createChat;
