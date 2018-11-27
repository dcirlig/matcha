// Imports
var express = require("express");
var registerCtrl = require("./controllers/registerCtrl");
var loginCtrl = require("./controllers/loginCtrl");
var verifyEmailCtrl = require("./controllers/verifyEmailCtrl");
var resetPassword = require("./controllers/resetCtrl");
var resetConfirmPassword = require("./controllers/resetConfirmCtrl");
var profilCtrl = require("./controllers/profilCtrl");
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
  return Router;
})();
