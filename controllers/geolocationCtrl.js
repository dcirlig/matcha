var modelsLoc = require("../models/geoloc");
var modelsUser = require("../models/user");

module.exports = {
  fillAddress: function (req, res) {
    var locationData = {
      latitude: req.body.coords.latitude,
      longitude: req.body.coords.longitude,
      userId: req.body.userId
    };

    var locationUser = {
      localisation: req.body.fullAddress
    };

    var userData = {
      userId: req.body.userId
    };

    const longitudeStr = locationData.longitude.toString();
    const latitudeStr = locationData.latitude.toString();

    if (
      !locationData.latitude ||
      !locationData.longitude ||
      !locationUser.localisation
    ) {
      return res.json({
        error: "Missing required fields in the user address."
      });
    } else if (
      !latitudeStr.match(/^(\-?\d+(\.\d+)?).\s*(\-?\d+(\.\d+)?)$/) ||
      !longitudeStr.match(/^(\-?\d+(\.\d+)?).\s*(\-?\d+(\.\d+)?)$/)
    ) {
      return res.json({
        error: "Invalid latitude or/and longitude value(s)."
      });
    } else {
      if (userData) {
        modelsLoc.doesExist(userData, function (find) {
          if (find) {
            modelsLoc.updateLocation(locationData, userData.userId);
          } else {
            modelsLoc.createLocation(locationData);
          }
          modelsUser.updateUser(locationUser, userData.userId);
          return res.status(200).json({
            fullAddress: locationUser.localisation,
            success: "User address successfully created or updated."
          });
        });
      } else {
        return res.json({ error: "user null" });
      }
    }
  },
  displayAddress: function (req, res) {
    const userId = req.body.userId;
    if (userId) {
      modelsUser.getUser("userId", userId, function (result) {
        if (result) {
          return res.status(200).json({
            fullAddress: result[0].localisation,
            success: "User address successfully extracted."
          });
        } else {
          return res.json({ error: "Address extraction failed." });
        }
      });
    } else {
      return res.json({ error: "user null" });
    }
  }
};
