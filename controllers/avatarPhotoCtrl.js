// // Imports
var multer = require("multer");
const path = require("path");
var fs = require("fs");
var images = require("../models/images");
var users = require("../models/user");
// Routes

var storage = multer.diskStorage({
  destination: "./view/public/profilPhoto",
  filename: function(req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single("myImage");

module.exports = {
  avatarPhoto: function(req, res) {
    upload(req, res, err => {
      if (req.file) {
        if (!req.file.originalname.match(/\.(jpg|jpeg)$/)) {
          res.json({ error: "Only format jpeg are allowed!" });
        } else {
          var filepath = req.file.path.replace("view/public/", "");
          var userData = {
            url: filepath,
            userId: req.body.userId
          };
          if (req.body.oldImageUrl) {
            var oldImageUrl = req.body.oldImageUrl.replace(
              "https://localhost:4000/",
              "view/public/"
            );
            fs.unlink(oldImageUrl, function(err) {});
          }
          res.json({ imageUrl: userData.url });
          users.updateUser(`profil_image='${userData.url}' `, userData.userId);
        }
      } else {
        res.json({ error: "Error upload photo" });
      }
    });
  },

  displayAvatarPhoto: function(req, res) {
    var userId = req.body.userId;
    users.getUser("userId", `${userId}`, function(result) {
      if (result) {
        result.forEach(element => {
          if (element.profil_image !== null) {
            res.json({ file: element.profil_image });
          } else {
            res.json({ error: "Please chose a profil photo" });
          }
        });
      } else {
        res.json({ error: "user not found" });
      }
    });
  }
};
