var chatModels = require("../models/chat");

module.exports = {
  getRooms: function (req, res) {
    if (req.body.userId) {
      var userId = parseInt(req.body.userId)
      chatModels.getRooms(userId, function (find) {
        var rooms = []
        for (var i = 0; i < find.length; i++) {
          if (find[i].userId1 == userId) {
            receiverId = find[i].userId2
            receiverName = find[i].username2
          } else if (find[i].userId2 == userId) {
            receiverId = find[i].userId1
            receiverName = find[i].username1
          }
          rooms = rooms.concat({ room: find[i].room, receiverId: receiverId, receiverName: receiverName, existingChat: find[i].existingChat })
        }
        return res.json({ success: "Matches or chats found", rooms: rooms })
      })
    }
    else {
      return res.json({ error: "No matches found." })
    }
  }
}