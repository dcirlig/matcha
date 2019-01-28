// Imports
var bcrypt = require("bcrypt-nodejs");
var jwtUtils = require("../utils/utils");
var models = require("../models/user");

// Routes
module.exports = {
  login: function(req, res) {
    var userData = {
      username: req.body.username,
      passwd: req.body.passwd,
      latitude: req.body.coords.latitude,
      longitude: req.body.coords.longitude
    };
    if (userData.username && userData.passwd) {
      if (
        !userData.username.match(/^[a-zA-Z0-9_]+$/) ||
        !userData.passwd.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
        ) ||
        (userData.username < 4 ||
          userData.username > 20 ||
          userData.passwd.length < 8 ||
          userData.passwd.length > 20)
      ) {
        return res.json({
          error: "Invalid parameters!!!"
        });
      } else {
        models.getUser("username", userData.username, function(result) {
          if (result && result.length > 0) {
            result.forEach(function(element) {
              if (element.emailVerified == false && element.secretToken != "") {
                return res.json({ error: "Please verify your email" });
              } else {
                bcrypt.compare(userData.passwd, element.passwd, function(
                  errBycrypt,
                  resBycrypt
                ) {
                  if (resBycrypt) {
                    var objUpdate = { online: "online" };
                    models.updateUser(objUpdate, element.userId);
                    return res.status(200).json({
                      success: "you are login",
                      userId: element.userId,
                      token: jwtUtils.generateTokenForUser(userData),
                      username: element.username,
                      coords: {
                        latitude: userData.latitude,
                        longitude: userData.longitude
                      }
                    });
                  } else {
                    return res.json({ error: "Wrong username or password" });
                  }
                });
              }
            });
          } else {
            return res.json({
              error: "Wrong username or password"
            });
          }
        });
      }
    } else {
      return res.json({ error: "Missing parameters or invalid parameters" });
    }
  }
};
