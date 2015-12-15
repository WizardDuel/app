var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('./sockets')(io);

//setup
var mongoose = require('mongoose');
//mongoose.connect('mongodb//localhost:3000');

app.use(express.static(__dirname + '/public'));

//routes
var spellRoutes = require('./routes/spellRoutes.js');
app.use('/spells', spellRoutes);

http.listen(3000, function() {
  console.log('listening on *:3000');
});
