// Imports
var bcrypt = require("bcrypt-nodejs");
var users = require("../models/user");
var connection = require("../database/dbConnection");

// Routes

module.exports = {
  settings: function(req, res) {
    // Params
    var username = [];
    var email = [];
    var data = {};

    var userId = req.body.userId;
    if (userId) {
      users.findOne("userId", `${userId}`, function(find) {
        if (find) {
          var userData = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            new_password: req.body.new_password,
            confirm_new_passwd: req.body.confirm_new_passwd
          };

          sql = "SELECT username, email FROM users";
          connection.query(sql, function(err, result) {
            if (err) console.log(err);
            if (result) {
              result.forEach(element => {
                username.push(element.username);
                email.push(element.email);
              });
            }

            if (
              userData.firstname &&
              userData.firstname.length >= 4 &&
              userData.firstname.length <= 20
            ) {
              if (!userData.firstname.match(/^[a-zA-Z-]+$/)) {
                return res.json({
                  error:
                    "Forbidden characters! Your firstname can only contain letters!"
                });
              } else {
                data["firstname"] = userData.firstname;
              }
            }

            if (
              userData.lastname &&
              userData.lastname.length >= 4 &&
              userData.lastname.length <= 20
            ) {
              if (!userData.lastname.match(/^[a-zA-Z ]+$/)) {
                return res.json({
                  error:
                    "Forbidden characters! Your lastname can only contain letters!"
                });
              } else {
                data["lastname"] = userData.lastname;
              }
            }

            if (
              userData.username &&
              userData.username.length >= 4 &&
              userData.username.length <= 20
            ) {
              if (!userData.username.match(/^[a-zA-Z0-9_]+$/)) {
                return res.json({
                  error:
                    "Forbidden characters! Your username can only contain letters, numbers or '_'!"
                });
              } else if (username.indexOf(userData.username) > -1) {
                return res.json({
                  error: "This username exist! Please choose another username"
                });
              } else {
                data["username"] = userData.username;
              }
            }

            if (
              userData.email &&
              userData.email.length >= 8 &&
              userData.email.length <= 50
            ) {
              if (
                !userData.email.match(
                  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
                )
              ) {
                return res.json({
                  error: "Invalid email!"
                });
              } else if (email.indexOf(userData.email) > -1) {
                return res.json({
                  error: "This email exist! Please choose another email"
                });
              } else {
                data["email"] = userData.email;
              }
            }

            if (
              userData.new_password &&
              userData.new_password.length >= 8 &&
              userData.new_password.length <= 20
            ) {
              if (
                !userData.new_password.match(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
                )
              ) {
                return res.json({
                  error:
                    "Your password must contain at least 1 number, 1 lowercase and 1 upper case letter"
                });
              }

              if (
                !userData.confirm_new_passwd.match(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
                )
              )
                return res.json({
                  error:
                    "Your password must contain at least 1 number, 1 lowercase and 1 upper case letter"
                });
              if (userData.new_password !== userData.confirm_new_passwd) {
                res.json({
                  error:
                    "Your new password and confirm passford are different! Try again!"
                });
              } else {
                userData.new_password = bcrypt.hashSync(userData.new_password);
                data["passwd"] = userData.new_password;
              }
            }
            if (Object.keys(data).length > 0) {
              users.updateUser(data, userId);
              res.json({ success: "The parameters has successfully changed" });
            } else {
              res.json({ error: "Empty fields" });
            }
          });
        } else {
          res.json({ error: "User does not exists!" });
        }
      });
    } else {
      return res.json({ error: "user null" });
    }
  }
};
