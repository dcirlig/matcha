// Imports
var models = require("../models/user");
var escapeHtml = require("../utils/utils").escapeHtml;

// Routes
module.exports = {
  userProfil: function(req, res) {
    if (req.params.username) {
      var username = escapeHtml(req.params.username);
      var userData = {
        localisation: req.body.localisation,
        bio: req.body.bio,
        gender: req.body.gender,
        sexual_orientation: req.body.sexual_orientation,
        interests: req.body.interests,
        profil_image: req.body.profil_image
      };

      if (
        userData.location !== "" &&
        userData.gender !== "" &&
        (userData.gender === "female" || userData.gender === "male") &&
        !userData.profil_image &&
        userData.bio.length <= 500 &&
        userData.sexual_orientation !== "" &&
        userData.interests !== ""
      ) {
        models.findOne("username", username, function(find) {
          if (find) {
            models.getUser("username", username, function(result) {
              if (result) {
                result.forEach(element => {
                  models.updateUser(
                    `localisation='${userData.localisation}', bio='${
                      userData.bio
                    }', gender = '${userData.gender}', sexual_orientation='${
                      userData.sexual_orientation
                    }', profil_image='${userData.profil_image}'`,
                    element.userId
                  );
                  return res.status(200).json({
                    success: "Successfully completed"
                  });
                });
              } else {
                res.json({ error: "user does not exists" });
              }
            });
          } else {
            return res.json({ error: "User does not exist" });
          }
        });
      } else {
        res.json({ error: "Please complete the required fields" });
      }
    }
  }
};
