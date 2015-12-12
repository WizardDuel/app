var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Battle = require('./lib/Battle');

app.use(express.static(__dirname + '/public'));

// Events
var DUEL = 'Duel';
var BEGIN = 'Begin'
var CHAT_MSG = 'chat message';
var NEW_USR = 'new user';
var ATTACK_PU = 'Attack Power Up';
var RESOLVE_ATTACK = 'Resolve Attack';
var PERRY = 'Perry';
var RECOVER = 'Recover';
var DEFEND = 'Defend';
var WIZ_ID = 'Wizard Id';

// Battle State
var numUsers = 0;
var battles = {};
var openBattles = []

io.on('connection', function(socket) {
  io.sockets.connected[socket.id].emit('id', socket.id);

  socket.on(DUEL, function(data) {
    console.log(socket.id);
    if (openBattles.length > 0) {
      // other wiz waiting to fight?
      // add socket to battle
      var battle = openBattles.pop();
      battle.addCombatant(socket);
      battles[battle.id] = battle;
      io.emit(BEGIN)
    } else {
      openBattles.push(new Battle(socket));
    }
  })


  socket.on('new user', function(data) {
    console.log(data);
    socket.user = data;
    numUsers++
    socket.broadcast.emit('user joined', socket.user);
  })

  socket.on('disconnect', function() {
    io.emit('disconnect');
  });

  socket.on('chat message', function(msg) {
    io.emit('chat received', {
      message: msg,
      user: socket.user
    });
  });
  socket.on(ATTACK_PU, function(data) {
    socket.broadcast.emit('Attack Power Up', data)
  });

});

http.listen(3000, function() {
  console.log('listening on *:3000')
});
