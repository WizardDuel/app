var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('./server-files/sockets')(io);

var port = process.env.PORT || 3000;
app.set('env', process.env.NODE_ENV);

var path = require('path');
app.get('/landing', function(req, res) {
  res.sendFile(path.resolve(__dirname, './public/landing/landing.html'));
});
//setup
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:3000');

app.use(express.static(__dirname + '/client'));

//routes
var spellRoutes = require('./server-files/routes/spellRoutes.js');
app.use('/spells', spellRoutes);

http.listen(port, function() {
  console.log('listening on: ', port);
});
