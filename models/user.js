var connection = require("../database/dbConnection");
var modelsLoc = require("./geoloc");

function createUser(userData) {
  sql = "INSERT INTO users SET ?";
  connection.query(sql, userData, function(err, result) {
    if (err) console.log(err);
  });
}

function updateUser(objUpdate, userData) {
  sql = "UPDATE users SET ? WHERE userId=?";
  connection.query(sql, [objUpdate, userData], function(err, result) {
    if (err) console.log(err);
  });
}

function findOne(field, userData, callback) {
  sql = "SELECT " + field + " FROM users WHERE " + field + "= ?";
  connection.query(sql, userData, function(err, result) {
    if (err) console.log(err);
    if (result.length > 0) find = 1;
    else find = 0;
    return callback(find);
  });
}

function getUser(field, userData, callback) {
  sql = "SELECT * FROM users WHERE " + field + "=?";
  connection.query(sql, userData, function(err, result) {
    if (err) console.log(err);
    if (result) return callback(result);
    else callback(0);
  });
}

function createUserAndLocation(userData, userCoords) {
  sql = "INSERT INTO users SET ?";
  connection.query(sql, userData, function(err, result) {
    if (err) console.log(err);
    else {
      userCoords.userId = result.insertId;
      modelsLoc.createLocation(userCoords);
    }
  });
}

exports.createUser = createUser;
exports.getUser = getUser;
exports.findOne = findOne;
exports.updateUser = updateUser;
exports.createUserAndLocation = createUserAndLocation;
