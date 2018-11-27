var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "rootnode",
  password: "rootnode"
});

con.connect(function(err) {
  if (err) console.log(err);
  var sql = `CREATE DATABASE IF NOT EXISTS db_matcha`;
  con.query(sql, function(err, result) {
    if (err) console.log(err);
    console.log("Database created!");

    con = mysql.createConnection({
      host: "localhost",
      user: "rootnode",
      password: "rootnode",
      database: "db_matcha"
    });

    con.connect(function(err) {
      if (err) console.log(err);
      console.log("Connected to database!");
      sql = "DROP TABLE IF EXISTS `users`";
      con.query(sql, function(err, result) {
        if (err) console.log(err);
        console.log("Delete users table");
      });
      var sql = `CREATE TABLE if NOT EXISTS users
    (
    userId            INTEGER AUTO_INCREMENT PRIMARY KEY,
    firstname         VARCHAR(45) NOT NULL,
    lastname          VARCHAR(45) NOT NULL,
    email             VARCHAR(45) NOT NULL,
    username          VARCHAR(45) NOT NULL,
    passwd            VARCHAR(255) NOT NULL,
    emailVerified     VARCHAR(45) DEFAULT false,
    secretTokenEmail  VARCHAR(255) NOT NULL,
    gender     VARCHAR(45) DEFAULT 'female',
    resetPasswordToken VARCHAR(255) DEFAULT NULL
    )`;

      con.query(sql, function(err, result) {
        if (err) console.log(err);
        console.log("Create table users");
      });
    });
  });
});
