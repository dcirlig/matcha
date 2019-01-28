// Imports
var models = require("../models/user");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

// Routes
module.exports = {
    reset: function (req, res) {
        // Params
        var userData = {
            email: req.body.email
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
            userData.email &&
            userData.email.length >= 8 &&
            userData.email.length < 50
        ) {
            if (
                !userData.email.match(
                    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
                )
            )
                return res.json({
                    error: "Invalid email!"
                });

            models.findOne("email", userData.email, function (find) {
                if (find) {
                    models.getUser("email", userData.email, function (result) {
                        if (result) {
                            result.forEach(element => {
                                var secretToken = randomstring.generate();
                                objUpdate = { secretToken: secretToken };
                                models.updateUser(objUpdate, element.userId);
                                var url = `https://localhost:4000/password/reset/confirm/${secretToken}`;

                                transporter.sendMail({
                                    from: "matcha@matcha.com",
                                    to: userData.email,
                                    subject: "Reset password",
                                    html: `	
                  Hi ${element.username},
                  We got a request to reset your Matcha password. <a href="${url}">${url}</a>`
                                });
                            });
                            return res.status(200).json({
                                success: "Please check your emails to reset your password!"
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
