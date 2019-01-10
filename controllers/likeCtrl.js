var users = require("../models/user");
var connection = require("../database/dbConnection");
var likes = require("../models/like");

module.exports = {
  displayLike: function(req, res) {
    // console.log("body", req.body);
  },
  like: function(req, res) {
    var bodyLike = {
      likeTransmitter: parseInt(req.body.likeTransmitter),
      likedUser: parseInt(req.body.likedUser),
      liked: req.body.like
    };
    console.log(bodyLike);
    var popularity_score = parseInt(req.body.popularity_score);
    console.log(popularity_score);
    // console.log(req.body);
    if (bodyLike.likeTransmitter) {
      if (bodyLike.likedUser) {
        if (bodyLike.liked) {
          var sql = "SELECT  * FROM likes WHERE likeTransmitter=?";
          var likeTransmitterList = [];
          var match = false;
          connection.query(sql, bodyLike.likedUser, function(err, result) {
            if (err) console.log(err);
            if (result) {
              result.forEach(element => {
                likeTransmitterList.push(element.likedUser);
              });
              if (likeTransmitterList.includes(bodyLike.likeTransmitter)) {
                match = true;
              }
              console.log(likeTransmitterList);

              var objUpdate = { popularity_score: popularity_score + 1 };

              likes.insertLike(bodyLike);
              users.updateUser(objUpdate, bodyLike.likedUser);
              return res.json({
                success: "You have liked this user!",
                popularity_score: popularity_score + 1,
                match: match
              });
            }
          });
        } else {
          var objUpdate = { popularity_score: popularity_score - 1 };
          users.updateUser(objUpdate, bodyLike.likedUser);
          sql = "DELETE FROM likes WHERE likeTransmitter=? && likedUser=?";
          connection.query(
            sql,
            [bodyLike.likeTransmitter, bodyLike.likedUser],
            function(err, result) {
              if (err) console.log(err);
              // if (result) console.log("result", result);
            }
          );
          return res.json({
            success: "You have disliked  this user!",
            popularity_score: popularity_score - 1,
            match: false
          });
        }
      } else {
        return res.json({ error: "Wrong liked userId!" });
      }
    } else {
      return res.json({ error: "Please log in for to like this user!" });
    }
  }
};
