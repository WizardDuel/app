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
var REPOST = 'Repost'
var RECOVER = 'Recover';
var DEFEND = 'Defend';
var WIZ_ID = 'Wizard Id';

// Battle State
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
      battles[battle.id()] = battle;
      io.emit(BEGIN)
    } else {
      openBattles.push(new Battle(socket));
    }
  });

  socket.on('disconnect', function() {
    io.emit('disconnect');
  });

  socket.on(ATTACK_PU, function(data) {
    console.log(ATTACK_PU, data);
    battles[socket.battleId][socket.id].attacks.push(new Attack(data));
    socket.broadcast.emit(ATTACK_PU, data)
  });
  socket.on(PERRY, function(data) {
    console.log(data);
  });

  socket.on(REPOST, function(data) {
    console.log(data);
  });

});

http.listen(3000, function() {
  console.log('listening on *:3000')
});
