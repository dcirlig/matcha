var connection = require("../database/dbConnection");

function createTag(tagText) {
  sql = "INSERT INTO interests (`content`) VALUES (?)";
  connection.query(sql, tagText, function(err, result) {
    if (err) console.log(err);
  });
}

function addTagsUser(newTagsList, username) {
  sql = `UPDATE users SET tags=? WHERE username=?`;
  connection.query(sql, [newTagsList, username], function(err, result) {
    if (err) console.log(err);
  });
}

function findTag(content, tagText, callback) {
  sql = `SELECT ${content} FROM interests WHERE ${content}= ?`;
  connection.query(sql, tagText, function(err, result) {
    if (err) console.log(err);
    if (result.length > 0) find = 1;
    else find = 0;
    return callback(find);
  });
}

function allTags(callback) {
  sql = `SELECT content FROM interests`;
  connection.query(sql, function(err, result) {
    if (err) console.log(err);
    return callback(result);
  });
}

function findTags(userData, callback) {
  sql = "SELECT tags FROM users WHERE username = ?";
  connection.query(sql, userData, function(err, result) {
    if (err) console.log(err);
    if (result) {
      return callback(result[0].tags);
    }
  });
}

function deleteTagUser(userData, tagToDelete, callback) {
  sql = "SELECT tags FROM users WHERE username = ?";
  connection.query(sql, userData, function(err, result) {
    if (err) console.log(err);
    var newTagsList = result[0].tags.replace(", " + tagToDelete, "");
    if (newTagsList === result[0].tags) {
      newTagsList = result[0].tags.replace(tagToDelete + ", ", "");
    }
    if (newTagsList === result[0].tags) {
      newTagsList = result[0].tags.replace(tagToDelete, "");
    }
    addTagsUser(newTagsList, userData);
    return callback(newTagsList);
  });
}

exports.findTag = findTag;
exports.findTags = findTags;
exports.createTag = createTag;
exports.addTagsUser = addTagsUser;
exports.deleteTagUser = deleteTagUser;
exports.allTags = allTags;
