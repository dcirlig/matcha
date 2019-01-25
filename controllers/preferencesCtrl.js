var models = require("../models/user");
var escapeHtml = require("../utils/utils").escapeHtml;
module.exports = {
  displayPreferences: function(req, res) {
    const userId = req.body.userId;
    if (userId) {
      models.getUser("userId", userId, function(result) {
        if (result) {
          return res.status(200).json({
            success: "User found and information successfully extracted.",
            gender: result[0].gender,
            bio: result[0].bio,
            sexualOrientation: result[0].sexual_orientation,
            birthDate: result[0].birthdate,
            age: result[0].age
          });
        } else {
          return res.status(200).json({
            error: "User not found or fail in information extraction"
          });
        }
      });
    }
  },
  updatePreferences: function(req, res) {
    const userId = req.body.userId;
    const gender = escapeHtml(req.body.data.gender);
    const sexualOrientation = escapeHtml(req.body.data.sexualOrientation);
    const bio = escapeHtml(req.body.data.bio);
    const age = parseInt(req.body.data.age);
    const birthdate = req.body.data.birthdate;
    var objUpdate = {};
    if (gender && (gender == "female" || gender === "male")) {
      objUpdate = { gender: gender };
    } else if (
      sexualOrientation &&
      (sexualOrientation === "bisexual" ||
        (sexualOrientation === "homosexual" &&
          sexualOrientation === "heterosexual"))
    ) {
      objUpdate = { sexual_orientation: sexualOrientation };
    } else if (bio && bio.length <= 140) {
      objUpdate = { bio: bio };
    } else if (age && birthdate) {
      objUpdate = { age: age, birthdate: birthdate };
    }
    // else {
    //   return res.json({
    //     error: "Invalid parameter!"
    //   });
    // }
    console.log("objupdate", objUpdate);
    if (userId && objUpdate) {
      models.updateUser(objUpdate, userId);
      return res.status(200).json({
        success: "Information successfully updated."
      });
    } else {
      return res.json({ error: "user null" });
    }
  }
};
