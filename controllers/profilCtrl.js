// Imports
var models = require("../models/user");
var imgModels = require("../models/images");
var geolocModels = require("../models/geoloc");
var escapeHtml = require("../utils/utils").escapeHtml;

// Routes

module.exports = {
  userProfil: function (req, res) {
    if (req.params.username) {
      var username = escapeHtml(req.params.username);
      models.findOne("username", username, function (find) {
        if (find) {
          models.getUser("username", username, function (result) {
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
                imgModels.getImage("userId", element.userId, function (images) {
                  if (images) {
                    imagesUser = images;
                  } else {
                    imagesUser = "";
                  }
                  element.images = imagesUser;
                  var user = [
                    {
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
                      popularityScore: element.popularity_score
                    }
                  ];
                  return res.json({ success: user });
                });
              });
            } else if (!result) {
              return res.json({ error: "This user does not exists" });
            }
          });
        } else if (!req.params.username) {
          return res.json({
            error:
              "This member does not exist or did not complete his/her profile info."
          });
        }
      });
    }
  },
  profileComplete: function (req, res) {
    if (req.body.userId) {
      var userId = req.body.userId
      models.getUser("userId", userId, (data) => {
        if (data && data.length > 0) {
          if (data[0].firstname && data[0].firstname.length > 0) {
            var firstname = data[0].firstname
          }
          if (data[0].lastname && data[0].lastname.length > 0) {
            var lastname = data[0].lastname
          }
          if (data[0].username && data[0].username.length > 0) {
            var username = data[0].username
          }
          if (data[0].gender && data[0].gender.length > 0) {
            var gender = data[0].gender
          }
          if (data[0].age) {
            var age = data[0].age
          }
          if (data[0].bio && data[0].bio.length > 0) {
            var bio = data[0].bio
          }
          if (data[0].tags && data[0].tags.length > 0) {
            var tags = data[0].tags
          }
          if (data[0].sexual_orientation && data[0].sexual_orientation.length > 0) {
            var sexual_orientation = data[0].sexual_orientation
          }
          if (data[0].profil_image && data[0].profil_image.length > 0) {
            var profil_image = data[0].profil_image
          }
          if (firstname && lastname && username && gender && age && bio && tags && sexual_orientation && profil_image) {
            geolocModels.getLocation(userId, (results) => {
              if (results && results.length > 0) {
                var latitude = results[0].latitude
                var longitude = results[0].longitude
                if (longitude && latitude) {
                  return res.json({ success: "Complete profile. Access authorized." })
                } else {
                  return res.json({ error: "This member does did not complete his/her profile info." })
                }
              } else {
                return res.json({ error: "This member does did not complete his/her profile info." })
              }
            })
          } else {
            return res.json({ error: "This member does did not complete his/her profile info." })
          }
        } else
          return res.json({ error: "This member does not exist or did not complete his/her profile info." })
      })
    } else {
      return res.json({ error: "This member does not exist" })
    }
  }
};
