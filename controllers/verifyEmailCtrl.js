// // Imports
var models = require("../models/user");
var url = require("url");
var escapeHtml = require("../utils/utils").escapeHtml;

// Routes
module.exports = {
  verify: function(req, res) {
    if (req.params.token) {
      var token = escapeHtml(req.params.token);
      models.getUser("secretTokenEmail", token, function(result) {
        if (result) {
          result.forEach(function(element) {
            if (
              element.secretTokenEmail == token &&
              element.secretTokenEmail != ""
            ) {
              if (element.emailVerified == false) {
                models.updateUser(
                  "emailVerified=true, secretTokenEmail=''",
                  element.userId
                );
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
