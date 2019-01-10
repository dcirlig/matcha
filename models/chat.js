var connection = require("../database/dbConnection");

function createChat(chatData) {
  sql = "INSERT INTO chats SET ?";
  connection.query(sql, chatData, function(err, result) {
    if (err) console.log(err);
  });
}

exports.createChat = createChat;
