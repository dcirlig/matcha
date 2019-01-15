// Imports
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var Router = require("./apiRouter").router;
const https = require("https");
const fs = require("fs");


var server = express();
server.use(cors());
// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json({ limit: "1Mb" }));

// Configure routes
server.get("/", function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send("<h1>Bonjour sur mon serveur<h1/>");
});

server.use("/api/", Router);
// Launch server

const options = {
  key: fs.readFileSync("agent2-key.pem"),
  cert: fs.readFileSync("agent2-cert.pem"),
  rejectUnauthorized: false
};

var app = https.createServer(options, server)

app.listen(8081, () => {
  console.log("Server en ecoute");
});

var io = require('socket.io').listen(app);

io.on('connection', (socket) => {
  var user1
  var user1
  var chatRoom
  console.log("socketId", socket.id)
  socket.on('newMatch', function (chatDetails) {
    user1 = chatDetails.user1
    user1.id = chatDetails.chatRoom + user1
    user2 = chatDetails.user2
    chatRoom = chatDetails.chatRoom
    user2.id = chatDetails.chatRoom + user2
  })
  // socket.on('chatMessage', function (msg) {
  //   // console.log('message: ' + msg)
  //   io.emit('chat message', msg);
  // })

  socket.on('SEND_MESSAGE', (data) => {
    console.log(data)
    io.emit('RECEIVE_MESSAGE', data)
  })
})