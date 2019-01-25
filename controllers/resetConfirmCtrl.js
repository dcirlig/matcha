// Imports
var models = require("../models/user");
var escapeHtml = require("../utils/utils").escapeHtml;
var bcrypt = require("bcrypt-nodejs");

// Routes
module.exports = {
  resetConfirm: function(req, res) {
    // Params
    if (req.params.token) {
      var token = escapeHtml(req.params.token);
      models.findOne("secretToken", token, function(find) {
        if (find) {
          models.getUser("secretToken", token, function(result) {
            if (result) {
              result.forEach(element => {
                var password = escapeHtml(req.body.newpasswd);
                var confirmpassword = escapeHtml(req.body.confnewpasswd);
                if (password && confirmpassword) {
                  if (
                    !password.match(
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
                    )
                  )
                    return res.json({
                      error:
                        "Wrong password! Your password must contain at least 1 number, 1 lowercase and 1 upper case letter"
                    });
                  password = bcrypt.hashSync(password);
                  bcrypt.compare(confirmpassword, password, function(
                    errBycrypt,
                    resBycrypt
                  ) {
                    if (resBycrypt) {
                      objUpdate = { passwd: password, secretToken: "" };
                      models.updateUser(objUpdate, element.userId);
                      return res.status(200).json({
                        success: "Your password has been changed successfully."
                      });
                    } else {
                      return res.json({
                        error: "Passwords are different! try again!"
                      });
                    }
                  });
                } else {
                  return res.json({ error: "Empty parameters" });
                }
              });
            }
          });
        } else {
          return res.json({ error: "User does not exist" });
        }
      });
    } else {
      return res.json({ error: "Wrong link" });
    }
  }
};
