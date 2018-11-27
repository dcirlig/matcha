var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "rootnode",
  password: "rootnode",
  database: "db_matcha"
});

connection.connect();

module.exports = connection;
