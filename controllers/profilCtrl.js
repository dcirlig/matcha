// Imports
var models = require("../models/user");
var imgModels = require("../models/images");
var geolocModels = require("../models/geoloc");
var likeModels = require("../models/like");
var distModels = require("../models/distance");

// Routes

module.exports = {
  userProfil: function(req, res) {
    if (
      req.params.username &&
      req.params.username.length <= 20 &&
      req.params.username.length >= 4
    ) {
      var username = req.params.username;
      models.findOne("username", username, function(find) {
        if (find) {
          models.getUser("username", username, function(result) {
            if (result) {
              result.forEach(element => {
                if (element.tags) {
                  const tagTab = element.tags.split(", ");
                  var newTags = tagTab.map(tag => {
                    return {
                      id: tag,
                      text: "#" + tag
                    };
                  });
                  element.tags = newTags;
                } else {
                  element.tags = [];
                }
                imgModels.getImage("userId", element.userId, function(images) {
                  if (images) {
                    imagesUser = images;
                  } else {
                    imagesUser = "";
                  }
                  element.images = imagesUser;
                  var user = [
                    {
                      userId: element.userId,
                      firstname: element.firstname,
                      lastname: element.lastname,
                      username: element.username,
                      gender: element.gender,
                      age: element.age,
                      bio: element.bio,
                      tags: element.tags,
                      location: element.localisation,
                      sexualOrientation: element.sexual_orientation,
                      profilImage: element.profil_image,
                      images: imagesUser,
                      popularityScore: element.popularity_score,
                      online: element.online
                    }
                  ];
                  return res.json({ success: user });
                });
              });
            } else if (!result) {
              return res.json({ error: "This user does not exists" });
            }
          });
        } else {
          return res.json({
            error:
              "This member does not exist or did not complete his/her profile info."
          });
        }
      });
    } else {
      return res.json({
        error: "username invalid or empty"
      });
    }
  },
  profileComplete: function(req, res) {
    if (req.body.userId) {
      var userId = req.body.userId;
      models.getUser("userId", userId, data => {
        if (data && data.length > 0) {
          if (data[0].firstname) {
            var firstname = data[0].firstname;
          }
          if (data[0].lastname) {
            var lastname = data[0].lastname;
          }
          if (data[0].username) {
            var username = data[0].username;
          }
          if (data[0].gender) {
            var gender = data[0].gender;
          }
          if (data[0].age) {
            var age = data[0].age;
          }
          if (data[0].bio) {
            var bio = data[0].bio;
          }
          if (data[0].tags) {
            var tags = data[0].tags;
          }
          if (data[0].sexual_orientation) {
            var sexual_orientation = data[0].sexual_orientation;
          }
          if (data[0].profil_image && data[0].profil_image != null) {
            var profil_image = data[0].profil_image;
          }
          if (
            firstname &&
            lastname &&
            username &&
            gender &&
            age &&
            bio &&
            tags &&
            sexual_orientation &&
            profil_image
          ) {
            geolocModels.getLocation(userId, results => {
              if (results && results.length > 0) {
                var latitude = results[0].latitude;
                var longitude = results[0].longitude;
                if (longitude && latitude) {
                  return res.json({
                    success: "Complete profile. Access authorized."
                  });
                } else {
                  return res.json({
                    error:
                      "This member does did not complete his/her profile info."
                  });
                }
              } else {
                return res.json({
                  error:
                    "This member does did not complete his/her profile info."
                });
              }
            });
          } else {
            return res.json({
              error: "This member does did not complete his/her profile info."
            });
          }
        } else
          return res.json({
            error:
              "This member does not exist or did not complete his/her profile info."
          });
      });
    } else {
      return res.json({ error: "This member does not exist" });
    }
  },
  publicProfile: function(req, res) {
    if (req.body) {
      var userVisiting = parseInt(req.body.userVisiting);
      var userVisited = parseInt(req.body.userVisited);
      likeModels.getLikes(userVisiting, userVisited, data => {
        var userVisitedLikedYou = false;
        var userVisitedLiked = false;
        data.forEach(element => {
          if (
            element.likeTransmitter === userVisiting &&
            element.likedUser === userVisited
          ) {
            userVisitedLiked = true;
          } else if (
            element.likeTransmitter === userVisited &&
            element.likedUser === userVisiting
          ) {
            userVisitedLikedYou = true;
          }
        });
        geolocModels.getLocation(userVisiting, geoloc1 => {
          geolocModels.getLocation(userVisited, geoloc2 => {
            if (
              geoloc1 &&
              geoloc1.length > 0 &&
              geoloc2 &&
              geoloc2.length > 0
            ) {
              var dist = distModels.distance(
                geoloc1[0].latitude,
                geoloc1[0].longitude,
                geoloc2[0].latitude,
                geoloc2[0].longitude
              );
            } else {
              dist = 0;
            }
            var userInteractionsInfos = {
              likeBack: userVisitedLikedYou,
              liked: userVisitedLiked,
              dist: dist
            };
            return res.json({ userInteractions: userInteractionsInfos });
          });
        });
      });
    } else {
      return res.json({ error: "Users not found in the database." });
    }
  }
};
