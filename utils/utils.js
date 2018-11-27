// Imports
var jwt = require("jsonwebtoken");
const JWT_SIGN_SECRET = "c018198aabe9b866fb4bcb2d6a885934ba0f4c2b";
const randomstring = require("randomstring");
// Exported functions

function generateTokenForUser(userData) {
  return jwt.sign(
    {
      userId: userData.id
    },
    JWT_SIGN_SECRET,
    {
      expiresIn: "1h"
    }
  );
}

function escapeHtml(text) {
  var map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };

  return text.replace(/[&<>"']/g, function(m) {
    return map[m];
  });
}

exports.escapeHtml = escapeHtml;
exports.generateTokenForUser = generateTokenForUser;
