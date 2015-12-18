var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('./server/sockets')(io);

var port = process.env.PORT || 3000;
app.set('env', process.env.NODE_ENV);

var path = require('path');
app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname, './client/www/landing.html'));
});

app.get('/play', function(req, res) {
  res.sendFile(path.resolve(__dirname, './client/www/index.html'));
});
//setup
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:3000');

app.use(express.static(__dirname + '/client/www'));

//routes
var spellRoutes = require('./server/routes/spellRoutes.js');
app.use('/spells', spellRoutes);

http.listen(port, function() {
  console.log('listening on: ', port);
});
