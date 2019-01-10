var connection = require("../database/dbConnection");

function createTag(tagText) {
  sql = "INSERT INTO interests (`content`) VALUES (?)";
  connection.query(sql, tagText, function (err, result) {
    if (err) console.log(err);
  });
}

function addTagsUser(newTagsList, userId) {
  sql = `UPDATE users SET tags=? WHERE userId=?`;
  connection.query(sql, [newTagsList, userId], function (err, result) {
    if (err) console.log(err);
  });
}

function findTag(content, tagText, callback) {
  sql = `SELECT ${content} FROM interests WHERE ${content}= ?`;
  connection.query(sql, tagText, function (err, result) {
    if (err) console.log(err);
    if (JSON.parse(JSON.stringify(result)).length > 0) find = 1;
    else find = 0;
    return callback(find);
  });
}

function allTags(callback) {
  sql = `SELECT content FROM interests`;
  connection.query(sql, function (err, result) {
    if (err) console.log(err);
    return callback(result);
  });
}

function findTags(userId, callback) {
  sql = "SELECT tags FROM users WHERE userId = ?";
  connection.query(sql, userId, function (err, result) {
    if (err) console.log(err);
    if (result) {
      return callback(result[0].tags);
    } else {
      return callback("");
    }
  });
}

function deleteTagUser(userId, tagToDelete, callback) {
  sql = "SELECT tags FROM users WHERE userId = ?";
  connection.query(sql, userId, function (err, result) {
    if (err) console.log(err);
    var newTagsList = result[0].tags.replace(", " + tagToDelete, "");
    if (newTagsList === result[0].tags) {
      newTagsList = result[0].tags.replace(tagToDelete + ", ", "");
    }
    if (newTagsList === result[0].tags) {
      newTagsList = result[0].tags.replace(tagToDelete, "");
    }
    addTagsUser(newTagsList, userId);
    return callback(newTagsList);
  });
}

exports.findTag = findTag;
exports.findTags = findTags;
exports.createTag = createTag;
exports.addTagsUser = addTagsUser;
exports.deleteTagUser = deleteTagUser;
exports.allTags = allTags;
