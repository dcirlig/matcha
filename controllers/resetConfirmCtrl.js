// Imports
var models = require("../models/user");
var escapeHtml = require("../utils/utils").escapeHtml;
var bcrypt = require("bcrypt-nodejs");

// Routes
module.exports = {
  resetConfirm: function(req, res) {
    // Params
    if (req.params.token) {
      var token = req.params.token;
      models.findOne("resetPasswordToken", token, function(find) {
        if (find) {
          models.getUser("resetPasswordToken", token, function(result) {
            if (result) {
              result.forEach(element => {
                var password = req.body.newpasswd;
                var confirmpassword = req.body.confnewpasswd;
                if (password && confirmpassword) {
                  if (
                    !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,20}$/)
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
                      objUpdate = { passwd: password, resetPasswordToken: "" };
                      models.updateUser(objUpdate, element.userId);
                      return res.status(200).json({
                        success: "Your password is reset successfully"
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
