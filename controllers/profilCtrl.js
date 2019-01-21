// Imports
var models = require("../models/user");
var imgModels = require("../models/images");
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
  }
};
