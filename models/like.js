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
  sql = "UPDATE likes SET ? WHERE likeId=?";
  connection.query(sql, [objUpdate, bodyLike], function (err, result) {
    if (err) console.log(err);
  });
}

function getLikes(userVisiting, userVisited, callback) {
  sql = "SELECT * FROM Likes WHERE (likeTransmitter=? && likedUser=?) OR (likeTransmitter=? && likedUser=?)";
  connection.query(sql, [userVisiting, userVisited, userVisited, userVisiting], function (err, result) {
    if (err) { console.log(err); callback(err) }
    else if (result) { callback(result) }
  })
}

exports.insertLike = insertLike;
exports.deleteLike = deleteLike;
exports.updateLike = updateLike;
exports.getLikes = getLikes;