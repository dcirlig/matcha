var likes = require("../models/like");
var notifs = require("../models/notification");
var chat = require("../models/chat");
var report = require("../models/report");

module.exports = {
  blockUser: function (req, res) {
    if (req.body.userReporter && req.body.userReported) {
      var reportInfo = { blockTransmitter: req.body.userReporter, blockedUser: req.body.userReported }
      report.insertBlock(reportInfo)
      likes.deleteLike(req.body.userReporter, req.body.userReported)
      notifs.deleteNotif(req.body.userReporter, req.body.userReported)
      chat.isChat(req.body.userReporter, req.body.userReported, (data) => {
        if (data.length > 0) {
          if (data[0].chatRoom) {
            chat.deleteChat(data[0].chatRoom)
          }
        }
      })
      return res.json({ success: "This user has been successfully blocked." });
    }
    else { return res.json({ error: "Something went wrong" }); }
  },
  reportUser: function (req, res) {
    if (req.body.userReporter && req.body.userReported) {
      var reportInfo = { fakeReporter: req.body.userReporter, fakeUser: req.body.userReported }
      report.insertFake(reportInfo)
      var blockInfo = { blockTransmitter: req.body.userReporter, blockedUser: req.body.userReported }
      report.insertBlock(blockInfo)
      likes.deleteLike(req.body.userReporter, req.body.userReported)
      notifs.deleteNotif(req.body.userReporter, req.body.userReported)
      chat.isChat(req.body.userReporter, req.body.userReported, (data) => {
        if (data.length > 0) {
          if (data[0].chatRoom) {
            chat.deleteChat(data[0].chatRoom)
          }
        }
      })
      return res.json({ success: "This user has been successfully reported as a fake." });
    }
    else { return res.json({ error: "Something went wrong." }); }
  }
}