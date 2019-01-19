var connection = require("../database/dbConnection");

function createNotification(data) {
  sql = "INSERT INTO notifications SET ?";
  connection.query(sql, data, function(err, result) {
    if (err) console.log(err);
  });
}

function countNotSeenNotification(data, callback) {
  sql =
    "SELECT COUNT(notificationId) AS COUNT FROM notifications INNER JOIN users ON notifications.receiverId=users.userId WHERE notifications.receiverId=? AND notifications.seen=?";
  connection.query(sql, data, function(err, result) {
    if (err) console.log(err);
    if (result) return callback(result);
    else callback(0);
  });
}

function getAllNotif(data, callback) {
  var sql =
    "SELECT profil_image, username , content, time, senderId FROM notifications INNER JOIN users ON notifications.senderId=users.userId WHERE notifications.receiverId=?";
  connection.query(sql, data, function(err, result) {
    if (err) console.log(err);
    if (result) return callback(result);
    else callback(0);
  });
}

function updateNotif(objUpdate, userData) {
  sql = "UPDATE notifications SET ? WHERE receiverId=?";
  connection.query(sql, [objUpdate, userData], function(err, result) {
    if (err) console.log(err);
    console.log("res", result);
  });
}

exports.createNotification = createNotification;
exports.countNotSeenNotification = countNotSeenNotification;
exports.getAllNotif = getAllNotif;
exports.updateNotif = updateNotif;
