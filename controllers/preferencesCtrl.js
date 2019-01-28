var models = require("../models/user");

module.exports = {
  displayPreferences: function (req, res) {
    const userId = req.body.userId;
    if (userId) {
      models.getUser("userId", userId, function (result) {
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
  updatePreferences: function (req, res) {
    const userId = req.body.userId;
    var objUpdate = {};
    if (req.body.data.gender && (escape(req.body.data.gender) == "female" || escape(req.body.data.gender) === "male")) {
      objUpdate = { gender: escape(req.body.data.gender) };
    } else if (
      req.body.data.sexualOrientation &&
      (escape(req.body.data.sexualOrientation) === "bisexual" ||
        escape(req.body.data.sexualOrientation) === "homosexual" ||
        escape(req.body.data.sexualOrientation) === "heterosexual")
    ) {
      objUpdate = { sexual_orientation: escape(req.body.data.sexualOrientation) };
    } else if (req.body.data.bio && req.body.data.bio.toString().length <= 140 && req.body.data.bio.toString().match(
      /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s:,;?.!()[\]"'/]+$/
    )) {
      objUpdate = { bio: req.body.data.bio.toString() };
    } else if (req.body.data.age && req.body.data.birthdate) {
      objUpdate = { age: req.body.data.age, birthdate: req.body.data.birthdate };
    }
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
