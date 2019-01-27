// // Imports
var multer = require("multer");
const path = require("path");
var users = require("../models/user");
// Routes
var mmm = require("mmmagic"),
  Magic = mmm.Magic;
const fs = require("fs");
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
        var magic = new Magic(mmm.MAGIC_MIME_TYPE);
        magic.detectFile(req.file.path, function(err, result) {
          if (result !== "image/jpeg") {
            fs.unlink(req.file.path, function(err) {});
            return res.json({ error: "Only format jpeg are allowed!" });
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
            objUpdate = { profil_image: userData.url };
            users.updateUser(objUpdate, userData.userId);
            return res.json({
              succes: "You are successfuly uploaded your profi photo",
              imageUrl: userData.url
            });
          }
        });
      } else {
        return res.json({ error: "Error upload photo" });
      }
    });
  },

  displayAvatarPhoto: function(req, res) {
    var userId = req.body.userId;
    if (userId) {
      users.getUser("userId", `${userId}`, function(result) {
        if (result) {
          result.forEach(element => {
            if (element.profil_image !== null) {
              return res.json({ file: element.profil_image });
            } else {
              return res.json({ error: "Please chose a profil photo" });
            }
          });
        } else {
          return res.json({ error: "user not found" });
        }
      });
    } else {
      return res.json({ error: "user null" });
    }
  }
};
