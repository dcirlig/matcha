// Imports
var models = require("../models/user");
var escapeHtml = require("../utils/utils").escapeHtml;

// Routes
module.exports = {
  userProfil: function(req, res) {
    if (req.params.username) {
      var username = escapeHtml(req.params.username);
      models.findOne("username", username, function(find) {
        if (find) {
          models.getUser("username", username, function(result) {
            if (result) {
              result.forEach(element => {
                var data = {
                  username: element.username,
                  gender: element.gender
                };
                return res.status(200).json({ userData: data });
              });
            }
          });
        } else {
          return res.json({ error: "User does not exist" });
        }
      });
    }
  }
};
