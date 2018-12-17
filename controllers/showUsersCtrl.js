var users = require("../models/user");
var connection = require("../database/dbConnection");

function distance(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = {
  showUsers: function(req, res) {
    userId = req.body.userId;
    users.findOne("userId", userId, function(find) {
      if (find) {
        sql = `SELECT sexual_orientation, gender, latitude, longitude, popularity_score, tags, age 
            FROM users
            INNER JOIN geolocation ON users.userId = geolocation.userId
        WHERE users.userId=?`;
        connection.query(sql, userId, function(err, result) {
          if (err) console.log(err);
          if (result) {
            result.forEach(element => {
              if (element.sexual_orientation === "bisexual") {
                sql = `SELECT sexual_orientation, gender, latitude, longitude, popularity_score, tags, age
                FROM users
                INNER JOIN geolocation ON users.userId = geolocation.userId
                WHERE users.userId!=? && ((users.gender=? && 
                users.sexual_orientation=?) || (users.gender=? && users.sexual_orientation=?) 
                || users.sexual_orientation=? )`;
                if (element.gender === "female") {
                  objData = [
                    userId,
                    "male",
                    "heterosexual",
                    "female",
                    "homosexual",
                    "bisexual"
                  ];
                } else if (element.gender === "male") {
                  objData = [
                    userId,
                    "male",
                    "homosexual",
                    "female",
                    "heterosexual",
                    "bisexual"
                  ];
                }
              } else if (element.sexual_orientation === "homosexual") {
                sql = `SELECT sexual_orientation, gender, latitude, longitude, popularity_score, tags, age
                FROM users
                INNER JOIN geolocation ON users.userId = geolocation.userId
                WHERE users.userId!=? && (users.gender=? && 
                (users.sexual_orientation=? ||  users.sexual_orientation=?))`;
                if (element.gender === "female") {
                  objData = [userId, "female", "homosexual", "bisexual"];
                } else if (element.gender === "male") {
                  objData = [userId, "male", "homosexual", "bisexual"];
                }
              } else if (element.sexual_orientation === "heterosexual") {
                sql = `SELECT sexual_orientation, gender, latitude, longitude, popularity_score, tags, age
                FROM users
                INNER JOIN geolocation ON users.userId = geolocation.userId
                WHERE users.userId!=? && (users.gender=? && 
                (users.sexual_orientation=? ||  users.sexual_orientation=?))`;
                if (element.gender === "female") {
                  objData = [userId, "male", "heterosexual", "bisexual"];
                } else if (element.gender === "male") {
                  objData = [userId, "female", "heterosexual", "bisexual"];
                }
              }
              connection.query(sql, objData, function(error, results) {
                if (error) console.log(error);
                if (results.length > 0) {
                  results.forEach(user => {
                    user.dist = distance(
                      element.latitude,
                      element.longitude,
                      user.latitude,
                      user.longitude
                    );
                    var tags = element.tags.split(", ");
                    var count = 0;
                    tags.forEach(tag => {
                      if (user.tags.indexOf(tag) != -1) count += 1;
                    });
                    user.common_tags = count;
                  });
                  console.log("results=", results);
                } else {
                  return res.json({ success: "0 resultat" });
                }
              });
            });
          } else {
            return res.json({ error: "Empty response" });
          }
        });
      } else {
        return res.json({ error: "User does not exists!" });
      }
    });
  }
};
