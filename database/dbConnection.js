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

// pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });
module.exports = pool;

// connection.connect();

// module.exports = connection;
