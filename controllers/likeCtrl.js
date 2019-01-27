var users = require("../models/user");
var connection = require("../database/dbConnection");
var likes = require("../models/like");
var chat = require("../models/chat");
var randomstring = require("randomstring");
var moment = require("moment");

module.exports = {
  like: function (req, res) {
    var bodyLike = {
      likeTransmitter: parseInt(req.body.likeTransmitter),
      likedUser: parseInt(req.body.likedUser),
      liked: req.body.like
    };
    var popularity_score = parseInt(req.body.popularity_score);
    if (bodyLike.likeTransmitter) {
      if (bodyLike.likedUser) {
        if (bodyLike.liked) {
          var sql = "SELECT  * FROM likes WHERE likeTransmitter=?";
          var likeTransmitterList = [];
          var match = false;
          var room = "";
          connection.query(sql, bodyLike.likedUser, function (err, result) {
            if (err) console.log(err);
            if (result) {
              result.forEach(element => {
                likeTransmitterList.push(element.likedUser);
              });
              if (likeTransmitterList.includes(bodyLike.likeTransmitter)) {
                var chatData = {
                  userId1: bodyLike.likedUser,
                  userId2: bodyLike.likeTransmitter,
                  time: Date.now(),
                  room: "room" + randomstring.generate() + moment()
                };
                chat.createChat(chatData);
                match = true;
                room = chatData.room;
              }

              var objUpdate = { popularity_score: popularity_score + 1 };

              likes.insertLike(bodyLike);
              users.updateUser(objUpdate, bodyLike.likedUser);
              return res.json({
                success: "You have liked this user!",
                popularity_score: popularity_score + 1,
                match: match,
                status: "liked",
                chatRoom: room
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
            function (err, result) {
              if (err) console.log(err);
            }
          );
          chat.isChat(bodyLike.likeTransmitter, bodyLike.likedUser, function (
            data
          ) {
            if (data.length > 0) {
              if (data[0].chatRoom) {
                chat.deleteChat(data[0].chatRoom);
                return res.json({
                  isMatch: true,
                  success: "You have disliked this user!",
                  popularity_score: popularity_score - 1,
                  status: "disliked",
                  match: false
                });
              }
            } else {
              return res.json({
                success: "You have disliked this user!",
                popularity_score: popularity_score - 1,
                status: "disliked",
                match: false
              });
            }
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
