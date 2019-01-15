var chatModels = require("../models/chat");

module.exports = {
  getRooms: function (req, res) {
    console.log("coucou")
    if (req.params.userId) {
      var userId = parseInt(userId)
      chatModels.getRooms(userId, function (find) {
        console.log(find)
        return res.json({ success: "OK", rooms: find });
      })
    }
  }
}