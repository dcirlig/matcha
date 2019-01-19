var connection = require("../database/dbConnection");
var notification = require("../models/notification");
var users = require("../models/user");
var notif_list = [];
module.exports = {
  notifications: function (req, res) {
    var userId = req.body.userId;
    if (userId !== null) {
      users.findOne("userId", userId, function (find) {
        if (find) {
          notification.countNotSeenNotification([userId, 0], function (result) {
            if (result) {
              result.forEach(element => {
                count = element.COUNT;
              });
              return res.json({ success: count });
            } else {
              return res.json({ error: "notif not found" });
            }
          });
        } else {
          return res.json({ error: "User does not exists!" });
        }
      });
    }
  },
  getAllnotifications: function (req, res) {
    var userId = req.body.userId;

    if (userId !== null) {
      users.findOne("userId", userId, function (find) {
        if (find) {
          notification.getNotificatios("receiverId", userId, function (result) {
            if (result.length > 0) {
              notification.getAllNotif([userId], function (results) {
                return res.json({ success: results });
              });
            } else {
              return res.json({ error: "notif not found" });
            }
          });
        } else {
          res.json({ error: "User does not exists!" });
        }
      });
    }
  }
};
