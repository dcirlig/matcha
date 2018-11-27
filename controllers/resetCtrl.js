// Imports
var models = require("../models/user");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

// Routes
module.exports = {
  reset: function(req, res) {
    // Params
    var userData = {
      email: req.body.email
    };

    var transporter = nodemailer.createTransport({
      service: "mailtrap",
      host: "smtp.mailtrap.io",
      auth: {
        user: "d6476694e8e3a8",
        pass: "d12c44d19ee9be"
      }
    });

    if (userData.email) {
      if (
        !userData.email.match(
          /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
        )
      )
        return res.json({
          error: "Invalid email!"
        });

      models.findOne("email", userData.email, function(find) {
        if (find) {
          models.getUser("email", userData.email, function(result) {
            if (result) {
              result.forEach(element => {
                var secretToken = randomstring.generate();
                models.updateUser(
                  `resetPasswordToken='${secretToken}'`,
                  element.userId
                );
                var url = `https://localhost:4000/password/reset/confirm/${secretToken}`;

                transporter.sendMail({
                  to: userData.email,
                  subject: "Resset password",
                  html: `	
                  Hi ${element.username},
                  We got a request to reset your Instagram password. <a href="${url}">${url}</a>`
                });
              });
              return res.status(200).json({
                success: "Please verify your email for reset your password!"
              });
            }
          });
        } else {
          return res.json({
            error: "This user does not exist!"
          });
        }
      });
    } else {
      return res.json({
        error: "Please write your email!"
      });
    }
  }
};
