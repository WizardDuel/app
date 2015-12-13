var express = require('express');
var http = require('http');

var app = express();
var server = http.Server(app);

var socketIO = require('socket.io');
var io = socketIO(server);

var path= require('path');

app.use(express.static(path.join(__dirname, '..', 'client/www')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'client/www/index.html'));
});

server.listen(3000, function () {
  console.log('listening on port 3000 ...');
});
