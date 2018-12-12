var models = require("../models/user");

module.exports = {
  displayPreferences: function(req, res) {
    const userId = req.body.userId;
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
  },
  updatePreferences: function(req, res) {
    const userId = req.body.userId;
    const gender = req.body.data.gender;
    const sexualOrientation = req.body.data.sexualOrientation;
    const bio = req.body.data.bio;
    const age = req.body.data.age;
    const birthdate = req.body.data.birthdate;
    var objUpdate = {};
    if (gender) {
      objUpdate = { gender: gender };
    } else if (sexualOrientation) {
      objUpdate = { sexual_orientation: sexualOrientation };
    } else if (bio) {
      objUpdate = { bio: bio };
    } else if (age && birthdate) {
      objUpdate = { age: age, birthdate: birthdate };
    }
    models.updateUser(objUpdate, userId);
    res.status(200).json({
      success: "Information successfully updated."
    });
  }
};
