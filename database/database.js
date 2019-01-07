var mysql = require("mysql");
var fakeUsers = require("./fakeUsers");

var con = mysql.createConnection({
  host: "localhost",
  user: "rootnode",
  password: "rootnode"
});

con.connect(function (err) {
  if (err) console.log(err);
  var sql = `CREATE DATABASE IF NOT EXISTS db_matcha`;
  con.query(sql, function (err, result) {
    if (err) console.log(err);
    console.log("Database created!");

    con = mysql.createConnection({
      host: "localhost",
      user: "rootnode",
      password: "rootnode",
      database: "db_matcha"
    });

    con.connect(function (err) {
      if (err) console.log(err);
      console.log("Connected to database!");
      sql = "DROP TABLE IF EXISTS `images`";
      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Delete images table");
      });
      sql = "DROP TABLE IF EXISTS `interests`";
      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Delete interests table");
      });
      sql = "DROP TABLE IF EXISTS `geolocation`";
      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Delete geolocation table");
      });
      sql = "DROP TABLE IF EXISTS `users`";
      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Delete users table");
      });

      var sql = `CREATE TABLE if NOT EXISTS users
    (
    userId              INTEGER AUTO_INCREMENT PRIMARY KEY,
    firstname           VARCHAR(45) NOT NULL,
    lastname            VARCHAR(45) NOT NULL,
    email               VARCHAR(45) NOT NULL,
    username            VARCHAR(45) NOT NULL,
    passwd              VARCHAR(255) NOT NULL,
    emailVerified       VARCHAR(45) DEFAULT false,
    secretToken         VARCHAR(255) NOT NULL,
    gender              VARCHAR(45) DEFAULT 'female',
    age                 INT(2) DEFAULT 18,
    birthdate           VARCHAR(255) DEFAULT NULL,
    bio                 VARCHAR(255) DEFAULT '',
    tags                TEXT,
    localisation        VARCHAR(255) DEFAULT '',
    sexual_orientation  VARCHAR(255) DEFAULT 'bisexual',
    profil_image        VARCHAR(255) DEFAULT NULL,
    popularity_score    INT DEFAULT 0
    )`;

      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Create table users");
        var sql = `CREATE TABLE if NOT EXISTS geolocation
      (
      geolocId             INTEGER AUTO_INCREMENT PRIMARY KEY,
      latitude             VARCHAR(45) NOT NULL,
      longitude            VARCHAR(45) NOT NULL,
      userId               INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(userId)
      )`;

        con.query(sql, function (err, result) {
          if (err) console.log(err);
          console.log("Create table geolocation");
          fakeUsers.fakeUsers();
          console.log("Insert random users");
        });
      });

      var sql = `CREATE TABLE if NOT EXISTS images
    (
    imageId            INTEGER AUTO_INCREMENT PRIMARY KEY,
    url                VARCHAR(45) NOT NULL,
    uid                VARCHAR(255) NOT NULL,
    userId             INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId)
    )`;

      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Create table images");
      });

      var sql = `CREATE TABLE if NOT EXISTS interests
      (
      interestId         INTEGER AUTO_INCREMENT PRIMARY KEY,
      content            VARCHAR(45) NOT NULL
      )`;

      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Create table interests");
      });

      const tags = [["organic"], ["geek"], ["piercing"], ["vegan"], ["PHP"]];
      var sql = "INSERT INTO interests (content) VALUES ?";

      con.query(sql, [tags], function (err, result) {
        if (err) console.log(err);
        console.log("Create suggested interests");
      });
    });
  });
});

// fakeUsers.fakeUsers();