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
      sql = "DROP TABLE IF EXISTS `messages`";
      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Delete messages table");
      });
      sql = "DROP TABLE IF EXISTS `chats`";
      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Delete chats table");
      });
      sql = "DROP TABLE IF EXISTS `likes`";
      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Delete likes table");
      });
      sql = "DROP TABLE IF EXISTS `blocked`";
      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Delete blocked table");
      });
      sql = "DROP TABLE IF EXISTS `fake`";
      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Delete fake table");
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

      sql = "DROP TABLE IF EXISTS `notifications`";
      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Delete notifications table");
      });

      sql = "DROP TABLE IF EXISTS `users`";
      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Delete users table");
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

      var sql = `CREATE TABLE if NOT EXISTS users
    (
    userId              INTEGER AUTO_INCREMENT PRIMARY KEY,
    firstname           VARCHAR(45) NOT NULL,
    lastname            VARCHAR(45) NOT NULL,
    email               VARCHAR(45) NOT NULL,
    username            VARCHAR(45) NOT NULL,
    passwd              VARCHAR(255) NOT NULL,
    emailVerified      VARCHAR(45) DEFAULT false,
    secretToken         VARCHAR(255) NOT NULL,
    gender              VARCHAR(45) DEFAULT 'female',
    age                 INT(2) DEFAULT 18,
    birthdate           VARCHAR(255) DEFAULT NULL,
    bio                 VARCHAR(255) DEFAULT '',
    tags                TEXT,
    localisation        VARCHAR(255) DEFAULT '',
    sexual_orientation  VARCHAR(255) DEFAULT 'bisexual',
    profil_image        VARCHAR(255) DEFAULT NULL,
    popularity_score    VARCHAR(45) DEFAULT false,
    online               VARCHAR(45) DEFAULT false,
    socket_id             VARCHAR(255) DEFAULT ''  
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
          console.log("Insert random users");
          fakeUsers.fakeUsers((data) => {
            if (data) {
              console.log(data)
            }
          });

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

      var sql = `CREATE TABLE if NOT EXISTS likes
      (
      likeId            INTEGER AUTO_INCREMENT PRIMARY KEY,
      likeTransmitter             INTEGER NOT NULL,
      likedUser                   INTEGER NOT NULL,
      liked                      VARCHAR(45) DEFAULT false,
      FOREIGN KEY (likedUser) REFERENCES users(userId)
      )`;

      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Create table likes");
      });

      var sql = `CREATE TABLE if NOT EXISTS blocked
      (
      blockId            INTEGER AUTO_INCREMENT PRIMARY KEY,
      blockTransmitter             INTEGER NOT NULL,
      blockedUser                   INTEGER NOT NULL,
      FOREIGN KEY (blockedUser) REFERENCES users(userId)
      )`;

      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Create table blocked");
      });

      var sql = `CREATE TABLE if NOT EXISTS fake
      (
      fakeId            INTEGER AUTO_INCREMENT PRIMARY KEY,
      fakeReporter             INTEGER NOT NULL,
      fakeUser                   INTEGER NOT NULL,
      FOREIGN KEY (fakeUser) REFERENCES users(userId)
      )`;

      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Create table fake");
      });

      var sql = `CREATE TABLE if NOT EXISTS chats
      (
      chatId            INTEGER AUTO_INCREMENT PRIMARY KEY,
      userId1             INTEGER NOT NULL,
      userId2                   INTEGER NOT NULL,
      time                 VARCHAR(255) NOT NULL,
      room                       VARCHAR(255) NOT NULL,
      FOREIGN KEY (userId1) REFERENCES users(userId),
      FOREIGN KEY (userId2) REFERENCES users(userId)
      )`;

      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Create table chats");
      });

      var sql = `CREATE TABLE if NOT EXISTS messages
      (
      messageId            INTEGER AUTO_INCREMENT PRIMARY KEY,
      senderId             INTEGER NOT NULL,
      receiverId           INTEGER NOT NULL,
      content              VARCHAR(255) NOT NULL,
      time                 VARCHAR(255) NOT NULL,
      chatRoom             VARCHAR(255) NOT NULL,
      FOREIGN KEY (senderId) REFERENCES users(userId),
      FOREIGN KEY (receiverId) REFERENCES users(userId)
      )`;

      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Create table messages");
      });

      var sql = `CREATE TABLE if NOT EXISTS notifications
      (
      notificationId       INTEGER AUTO_INCREMENT PRIMARY KEY,
      senderId             INTEGER NOT NULL,
      receiverId           INTEGER NOT NULL,
      content              VARCHAR(255) NOT NULL,
      time                 VARCHAR(255) NOT NULL,
      seen                 VARCHAR(45) DEFAULT false
      )`;

      con.query(sql, function (err, result) {
        if (err) console.log(err);
        console.log("Create table notifications");
      });
    });
  });
});
