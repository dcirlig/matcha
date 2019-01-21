var connection = require("../database/dbConnection");

function insertLike(bodyLike) {
  sql = "INSERT INTO likes SET ?";
  connection.query(sql, bodyLike, function (err, result) {
    if (err) console.log(err);
  });
}

function deleteLike(likeTransmitter, likedUser) {
  sql = "DELETE FROM likes WHERE (likeTransmitter=? && likedUser=?) OR (likeTransmitter=? && likedUser=?)";
  connection.query(sql, [likeTransmitter, likedUser, likedUser, likeTransmitter], function (err, result) {
    if (err) console.log(err);
  }
  );
}

function updateLike(objUpdate, bodyLike) {
  console.log('objUpdate', objUpdate)
  sql = "UPDATE likes SET ? WHERE likeId=?";
  connection.query(sql, [objUpdate, bodyLike], function (err, result) {
    if (err) console.log(err);
  });
}

exports.insertLike = insertLike;
exports.deleteLike = deleteLike;
exports.updateLike = updateLike;
