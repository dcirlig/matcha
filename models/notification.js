var connection = require("../database/dbConnection");

function createNotification(data) {
  sql = "INSERT INTO notifications SET ?";
  connection.query(sql, data, function(err, result) {
    if (err) console.log(err);
  });
}

function getNotificatios(field, data, callback) {
  sql = "SELECT * FROM notifications WHERE " + field + "=?";
  connection.query(sql, data, function(err, result) {
    if (err) console.log(err);
    if (result) return callback(result);
    else callback(0);
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

exports.createNotification = createNotification;
exports.getNotificatios = getNotificatios;
exports.countNotSeenNotification = countNotSeenNotification;
exports.getAllNotif = getAllNotif;
