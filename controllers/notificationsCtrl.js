var connection = require("../database/dbConnection");
var notification = require("../models/notification");
var users = require("../models/user");
var distance = require("../models/distance");

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
              return res.json({ success: "notifications count", count: count });
            } else {
              return res.json({ error: "notif not found" });
            }
          });
        } else {
          return res.json({ error: "User does not exists!" });
        }
      });
    } else {
      return res.json({ error: "user null" });
    }
  },
  getAllnotifications: function (req, res) {
    var userId = req.body.userId;
    if (userId) {
      var sql = "SELECT latitude, longitude from geolocation WHERE userId=?";
      connection.query(sql, userId, function (err, result) {
        if (err) {
          console.log("error");
        }
        if (result) {
          result.forEach(element => {
            if (userId !== null) {
              users.findOne("userId", userId, function (find) {
                if (find) {
                  notification.getAllNotif(userId, function (results) {
                    if (results) {
                      results.forEach(user => {
                        user.dist = Math.round(
                          distance.distance(
                            element.latitude,
                            element.longitude,
                            user.latitude,
                            user.longitude
                          )
                        );
                      });
                      return res.json({
                        success: "you have get all notif",
                        list_notif: results
                      });
                    }
                  });
                } else {
                  res.json({ error: "User does not exists!" });
                }
              });
            }
          });
        }
      });
    } else {
      return res.json({ error: "user null" });
    }
  },
  updateNotif: function (req, res) {
    var userId = req.body.userId;
    if (userId !== null) {
      users.findOne("userId", userId, function (find) {
        if (find) {
          var data = { seen: 1 };
          notification.updateNotif(data, userId);
          return res.json({ success: "you have updated your notif", count: 0 });
        } else {
          res.json({ error: "User does not exists!" });
        }
      });
    } else {
      return res.json({ error: "user null" });
    }
  }
};
