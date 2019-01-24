// Imports
var express = require("express");
var registerCtrl = require("./controllers/registerCtrl");
var loginCtrl = require("./controllers/loginCtrl");
var verifyEmailCtrl = require("./controllers/verifyEmailCtrl");
var resetPassword = require("./controllers/resetCtrl");
var resetConfirmPassword = require("./controllers/resetConfirmCtrl");
var profilCtrl = require("./controllers/profilCtrl");
var tagCtrl = require("./controllers/tagCtrl");
var photoCtrl = require("./controllers/photoCtrl");
var avatarPhotoCtrl = require("./controllers/avatarPhotoCtrl");
var geolocationCtrl = require("./controllers/geolocationCtrl");
var settingsCtrl = require("./controllers/settingsCtrl");
var preferencesCtrl = require("./controllers/preferencesCtrl");
var settingsCtrl = require("./controllers/settingsCtrl");
var explorerCtrl = require("./controllers/explorerCtrl");
var likeCtrl = require("./controllers/likeCtrl");
var chatCtrl = require("./controllers/chatCtrl");
var notificationsCtrl = require("./controllers/notificationsCtrl");
var reportsCtrl = require("./controllers/reportsCtrl");
//Routes
exports.router = (function () {
  var Router = express.Router();

  // Users routes
  Router.route("/users/register").post(registerCtrl.register);
  Router.post("/users/login", loginCtrl.login);
  Router.post("/users/verify/:token", verifyEmailCtrl.verify);
  Router.post("/users/password/reset", resetPassword.reset);
  Router.post(
    "/users/password/reset/confirm/:token",
    resetConfirmPassword.resetConfirm
  );
  Router.get("/users/:username", profilCtrl.userProfil);
  Router.post("/profileComplete", profilCtrl.profileComplete);
  Router.post("/publicProfile", profilCtrl.publicProfile)
  Router.post("/tags/display", tagCtrl.displayTags);
  Router.post("/tags/add", tagCtrl.addTag);
  Router.post("/tags/delete", tagCtrl.deleteTag);
  Router.post("/uploadPhoto", photoCtrl.uploadPhoto);
  Router.post("/deletePhoto", photoCtrl.deletePhoto);
  Router.post("/displayPhoto", photoCtrl.displayPhoto);
  Router.post("/avatarPhoto", avatarPhotoCtrl.avatarPhoto);
  Router.post("/displayAvatarPhoto", avatarPhotoCtrl.displayAvatarPhoto);
  Router.post("/fillAddress", geolocationCtrl.fillAddress);
  Router.post("/displayAddress", geolocationCtrl.displayAddress);
  Router.post("/settings", settingsCtrl.settings);
  Router.post("/preferences/display", preferencesCtrl.displayPreferences);
  Router.post("/preferences/update", preferencesCtrl.updatePreferences);
  Router.post("/settings", settingsCtrl.settings);
  Router.post("/explorer", explorerCtrl.explorer);
  Router.post("/like", likeCtrl.like);
  Router.post("/chat/getRooms", chatCtrl.getRooms);
  Router.post("/chat/getConv", chatCtrl.getConv);
  Router.post("/chat/getLastMessage", chatCtrl.getLastMessage);
  Router.post("/notifications", notificationsCtrl.notifications);
  Router.post("/getAllnotifications", notificationsCtrl.getAllnotifications);
  Router.post("/updateNotif", notificationsCtrl.updateNotif);
  Router.post("/blockUser", reportsCtrl.blockUser);
  Router.post("/reportUser", reportsCtrl.reportUser);
  return Router;
})();
