// Imports
var bcrypt = require("bcrypt-nodejs");
var models = require("../models/user");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

// Routes
module.exports = {
  register: function (req, res) {
    // Params
    var userData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      username: req.body.username,
      passwd: req.body.passwd,
      gender: req.body.gender
    };

    var transporter = nodemailer.createTransport({
      service: "mailtrap",
      host: "smtp.mailtrap.io",
      auth: {
        user: "08a43c661c7311",
        pass: "8c65e78b005e6b"
      }
    });

    if (
      userData.firstname != "" &&
      userData.lastname != "" &&
      userData.email != "" &&
      userData.username != "" &&
      userData.passwd != "" &&
      userData.gender != ""
    ) {
      if (!userData.firstname.match(/^[a-zA-Z]+$/))
        return res.json({
          error:
            "Invalid first name! Your first name must contain only upper and lower case letters!"
        });

      if (!userData.lastname.match(/^[a-zA-Z]+$/))
        return res.json({
          error:
            "Invalid last name! Your last name must contain only upper and lower case letters!"
        });

      if (
        !userData.email.match(
          /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
        )
      )
        return res.json({
          error: "Invalid email!"
        });

      if (!userData.username.match(/^[a-zA-Z0-9_]+$/))
        return res.json({
          error:
            "Forbidden characters! Your username can only contain letters, numbers or '_'!"
        });

      if (!userData.passwd.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,20}$/))
        return res.json({
          error:
            "Wrong password! Your password must contain at least 1 number, 1 lowercase and 1 upper case letter"
        });

      if (userData.gender != "female" && userData.gender != "male")
        return res.json({
          error: "Wrong gender!"
        });

      models.findOne("email", userData.email, function (find) {
        if (find) {
          return res.json({
            error: "This email is used! Please choose another email!"
          });
        } else {
          models.findOne("username", userData.username, function (find) {
            if (find) {
              return res.json({
                error: "This username is used! Please choose another username!"
              });
            } else {
              userData.passwd = bcrypt.hashSync(userData.passwd);

              var secretToken = randomstring.generate();
              userData.secretToken = secretToken;
              models.createUser(userData);
              var url = `https://localhost:4000/verify/${userData.secretToken}`;

              transporter.sendMail({
                from: 'matcha@matcha.com',
                to: userData.email,
                subject: "confirm mail",
                html: `Please click this email to confirm your email <a href="${url}">${url}</a>`
              });

              return res.status(200).json({
                success:
                  "You have successfully registered your account. Please, verify your email for login!"
              });
            }
          });
        }
      });
    } else {
      return res.json({
        error: "Empty parameters"
      });
    }
  }
};
