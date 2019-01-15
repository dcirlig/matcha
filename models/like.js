var connection = require("../database/dbConnection");

function insertLike(bodyLike) {
  sql = "INSERT INTO likes SET ?";
  connection.query(sql, bodyLike, function (err, result) {
    if (err) console.log(err);
  });
}

function deleteLike(field, bodyLike, callback) {
  sql = "DELETE FROM likes WHERE " + field + "=?";
  connection.query(sql, bodyLike, function (err, result) {
    if (err) console.log(err);
    if (result.length > 0) return callback(result);
    else callback(0);
  });
}
function updateLike(objUpdate, bodyLike) {
  sql = "UPDATE likes SET ? WHERE likeId=?";
  connection.query(sql, [objUpdate, bodyLike], function (err, result) {
    if (err) console.log(err);
  });
}

exports.insertLike = insertLike;
exports.deleteLike = deleteLike;
exports.updateLike = updateLike;
