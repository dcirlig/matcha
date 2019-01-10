var connection = require("../database/dbConnection");

function insertImage(userData) {
  sql = "INSERT INTO images SET ?";
  connection.query(sql, userData, function(err, result) {
    if (err) console.log(err);
  });
}

function findOne(field, userData, callback) {
  sql = "SELECT " + field + " FROM images WHERE " + field + "= ?";
  connection.query(sql, userData, function(err, result) {
    if (err) console.log(err);
    if (result.length > 0) find = 1;
    else find = 0;
    return callback(find);
  });
}

function getImage(field, userData, callback) {
  sql = "SELECT * FROM images WHERE " + field + "=?";
  connection.query(sql, userData, function(err, result) {
    if (err) console.log(err);
    if (result.length > 0) return callback(result);
    else callback(0);
  });
}

function deleteImage(field, userData, callback) {
  sql = "DELETE FROM images WHERE " + field + "=?";
  connection.query(sql, userData, function(err, result) {
    if (err) console.log(err);
    if (result.length > 0) return callback(result);
    else callback(0);
  });
}

function deleteImage(field, userData, callback) {
  sql = "DELETE FROM images WHERE " + field + "=?";
  connection.query(sql, userData, function(err, result) {
    if (err) console.log(err);
    if (result)
      if (result.length > 0) find = 1;
      else find = 0;
    return callback(result);
  });
}

exports.insertImage = insertImage;
exports.findOne = findOne;
exports.getImage = getImage;
exports.deleteImage = deleteImage;
