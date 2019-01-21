var connection = require("../database/dbConnection");

function insertBlock(reportInfo) {
  sql = "INSERT INTO blocked SET ?";
  connection.query(sql, reportInfo, function (err, result) {
    if (err) console.log(err);
  });
}

function insertFake(reportInfo) {
  sql = "INSERT INTO fake SET ?";
  connection.query(sql, reportInfo, function (err, result) {
    if (err) console.log(err);
  });
}

exports.insertBlock = insertBlock;
exports.insertFake = insertFake;