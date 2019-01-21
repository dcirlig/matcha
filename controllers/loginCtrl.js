// Imports
var bcrypt = require("bcrypt-nodejs");
var jwtUtils = require("../utils/utils");
var models = require("../models/user");

// Routes
module.exports = {
  login: function (req, res) {
    var userData = {
      username: req.body.username,
      passwd: req.body.passwd,
      latitude: req.body.coords.latitude,
      longitude: req.body.coords.longitude
    };
    console.log('userData', userData)
    if (userData.username != null && userData.passwd != null) {
      if (!userData.username.match(/^[a-zA-Z0-9_]+$/)) {
        return res.json({
          error: "Please use your username!"
        });
      } else {
        models.getUser("username", userData.username, function (result) {
          if (result && result.length > 0) {
            result.forEach(function (element) {
              if (element.emailVerified == false && element.secretToken != "") {
                return res.json({ error: "Please verify your email" });
              } else {
                bcrypt.compare(userData.passwd, element.passwd, function (
                  errBycrypt,
                  resBycrypt
                ) {
                  if (resBycrypt) {
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
              error: "User not found! Please create a account"
            });
          }
        });
      }
    } else {
      return res.json({ error: "Missing parameters" });
    }
  }
};
