// Imports
var bcrypt = require("bcrypt-nodejs");
var jwtUtils = require("../utils/utils");
var models = require("../models/user");

// Routes
module.exports = {
  login: function(req, res) {
    // Params
    var userData = {
      username: req.body.username,
      passwd: req.body.passwd
    };

    if (userData.username != null && userData.passwd != null) {
      if (!userData.username.match(/^[a-zA-Z0-9_]+$/)) {
        return res.json({
          error: "Please use your username!"
        });
      } else {
        models.getUser("username", userData.username, function(result) {
          if (result) {
            result.forEach(function(element) {
              if (
                element.emailVerified == false &&
                element.secretTokenEmail != ""
              ) {
                return res.json({ error: "Please verify your email" });
              } else {
                bcrypt.compare(userData.passwd, element.passwd, function(
                  errBycrypt,
                  resBycrypt
                ) {
                  if (resBycrypt) {
                    return res.status(200).json({
                      success: "you are login",
                      userId: element.userId,
                      token: jwtUtils.generateTokenForUser(userData),
                      username: element.username
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
