var express = require('express');
var app = express();
var path = require('path');
var morgan = require('morgan');

//Setup Socket Server
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('./server/sockets')(io);

//App Setup
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
app.use(morgan('dev'));

// App Routing
app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname, './client/www/landing.html'));
});

app.use(express.static(__dirname + '/client/www'));

app.get('/play', function(req, res) {
  res.sendFile(path.resolve(__dirname, './client/www/index.html'));
});

http.listen(port, function() {
  console.log('listening on: ', port);
});
