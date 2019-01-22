var connection = require("../database/dbConnection");

function createNotification(data, callback) {
  sql = "INSERT INTO notifications SET ?";
  connection.query(sql, data, function(err, result) {
    if (err) console.log(err);
    if (result) callback(true);
    else callback(false);
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
    "SELECT * FROM notifications INNER JOIN users ON notifications.senderId=users.userId  INNER JOIN geolocation ON users.userId = geolocation.userId WHERE notifications.receiverId=? ORDER BY notificationId DESC";
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
  });
}

function deleteNotif(senderId, receiverId) {
  sql =
    "DELETE FROM notifications WHERE (senderId=? && receiverId=?) OR (senderId=? && receiverId=?)";
  connection.query(sql, [senderId, receiverId, receiverId, senderId], function(
    err,
    result
  ) {
    if (err) console.log(err);
  });
}

exports.createNotification = createNotification;
exports.countNotSeenNotification = countNotSeenNotification;
exports.getAllNotif = getAllNotif;
exports.updateNotif = updateNotif;
exports.deleteNotif = deleteNotif;
