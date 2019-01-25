// // Imports
var models = require("../models/user");
var url = require("url");

// Routes
module.exports = {
  verify: function (req, res) {
    if (req.params.token) {
      var token = escape(req.params.token);
      models.getUser("secretToken", token, function (result) {
        if (result) {
          result.forEach(function (element) {
            if (element.secretToken == token && element.secretToken != "") {
              if (element.emailVerified == false) {
                objUpdate = { emailVerified: true, secretToken: "" };
                models.updateUser(objUpdate, element.userId);
                return res.status(200).json({
                  success:
                    "You have successfully confirmed your email!You can log in now!"
                });
              } else {
                return res.json({
                  error: "Your email is already confirmed"
                });
              }
            } else {
              return res.json({
                error: "Wrong link. Please verify your mail!"
              });
            }
          });
        } else {
          return res.json({ error: "Wrong link" });
        }
      });
    } else {
      return res.json({ error: "Wrong link" });
    }
  }
};
