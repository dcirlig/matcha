// // Imports
var multer = require("multer");
const path = require("path");
var fs = require("fs");
var mmm = require("mmmagic"),
  Magic = mmm.Magic;
var images = require("../models/images");
// Routes

var storage = multer.diskStorage({
  destination: "./view/public/images/",
  filename: function(req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single("myImage");

module.exports = {
  uploadPhoto: function(req, res) {
    upload(req, res, err => {
      if (req.file) {
        var magic = new Magic(mmm.MAGIC_MIME_TYPE);
        magic.detectFile(req.file.path, function(err, result) {
          if (result !== "image/jpeg" && result !== "image/png") {
            fs.unlink(req.file.path, function(err) {});
            return res.json({ error: "Only image files are allowed!" });
          } else {
            var filepath = req.file.path.replace("view/public/", "");
            var userData = {
              url: filepath,
              userId: req.body.userId,
              uid: req.body.uid
            };
            if (req.body.status == "uploading") {
              images.insertImage(userData);
              return res.json({ success: "you have add photo" });
            }
          }
        });
      } else {
        return res.json({ error: "Error upload photo" });
      }
    });
  },
  deletePhoto: function(req, res) {
    if (req.body.uid) {
      images.findOne("uid", req.body.uid, function(find) {
        if (find) {
          images.getImage("uid", req.body.uid, function(result) {
            if (result) {
              result.forEach(element => {
                var filepath = element.url.replace(
                  "images",
                  "view/public/images"
                );
                fs.unlink(filepath, function(err) {});
                images.deleteImage("uid", element.uid, function(find) {});
                return res.json({ success: "you have delete a photo" });
              });
            } else {
              return res.json({ error: "Image not found" });
            }
          });
        } else {
          return res.json({ error: "Image not found" });
        }
      });
    } else {
      return res.json({ error: "image does not exists" });
    }
  },

  displayPhoto: function(req, res) {
    if (req.body.userId) {
      images.getImage("userId", req.body.userId, function(result) {
        if (result) {
          return res.json({
            success: "Found user's photo in db.",
            fileList: result
          });
        } else {
          return res.json({ error: "Photo not found." });
        }
      });
    } else {
      return res.json({ error: "user null" });
    }
  }
};
