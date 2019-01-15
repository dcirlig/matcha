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

// require('https').globalAgent.options.rejectUnauthorized = false;

var app = https.createServer(options, server)
var io = (module.exports.io = require("socket.io")(app));

const SocketManager = require("./SocketManager.js");

io.on('connection', SocketManager);

// require('./SocketManager.js')(io);

app.listen(8081, () => {
  console.log("Server en ecoute");
});