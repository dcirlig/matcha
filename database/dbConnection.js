var mysql = require("mysql");

// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "rootnode",
//   password: "rootnode",
//   database: "db_matcha"
// });

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "rootnode",
  password: "rootnode",
  database: "db_matcha",
  acquireTimeout: 100000000
});

module.exports = pool;