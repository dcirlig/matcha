var connection = require("../database/dbConnection");

function createLocation(locationData) {
  sql = `INSERT INTO geolocation SET ?`;
  connection.query(sql, locationData, function (err, result) {
    if (err) console.log(err);
  });
}

function updateLocation(locationData, userData) {
  sql = `UPDATE geolocation SET ? WHERE userId=?`;
  connection.query(sql, [locationData, userData], function (err, result) {
    if (err) console.log(err);
  });
}

function doesExist(userData, callback) {
  sql = `SELECT COUNT(*) FROM geolocation WHERE userId= ?`;
  connection.query(sql, userData.userId, function (err, result) {
    if (err) console.log(err);
    if (result[0]["COUNT(*)"] === 0) find = 0;
    else find = 1;
    return callback(find);
  });
}

function getLocation(userData, callback) {
  sql = `SELECT * FROM geolocation WHERE userId=?`;
  connection.query(sql, userData, function (err, result) {
    if (err) console.log(err);
    if (JSON.parse(JSON.stringify(result)).length > 0) return callback(result);
    else callback(0);
  });
}

exports.createLocation = createLocation;
exports.updateLocation = updateLocation;
exports.doesExist = doesExist;
exports.getLocation = getLocation;
