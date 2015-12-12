var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Battle = require('./lib/Battle');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var numUsers = 0;
var openBattle = true;
var battles = [];

io.on('connection', function(socket) {
  io.sockets.connected[socket.id].emit('id', socket.id);

  battles.push(new Battle(socket.id));

  // send id to client
  // add socket to a battle

  socket.on('new user', function(data) {
    console.log(data);
    socket.user = data;
    numUsers++;
    socket.broadcast.emit('user joined', socket.user);
  });

  socket.on('disconnect', function() {
    io.emit('disconnect');
  });

  socket.on('chat message', function(msg) {
    io.emit('chat received', {
      message: msg,
      user: socket.user
    });
  });
  socket.on('Attack Power Up', function(data) {
    socket.broadcast.emit('Attack Power Up', data);
  });

});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
