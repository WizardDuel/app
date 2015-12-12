var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Battle = require('./lib/Battle');
var path = require('path');

app.use(express.static(__dirname + '/public'));

app.get('/landing', function(req, res){
  res.sendFile(path.resolve(__dirname, './public/landing/landing.html'));
});

// Events
var DUEL = 'Duel';
var BEGIN = 'Begin';
var CHAT_MSG = 'chat message';
var NEW_USR = 'new user';
var ATTACK_PU = 'Attack Power Up';
var RESOLVE_ATTACK = 'Resolve Attack';
var PERRY = 'Perry';
var REPOST = 'Repost';
var RECOVER = 'Recover';
var DEFEND = 'Defend';
var WIZ_ID = 'Wizard Id';
var ATTACK = 'Attack';

// Battle State
var battles = {};
var openBattles = [];

io.on('connection', function(socket) {

  io.sockets.connected[socket.id].emit('id', socket.id);

  socket.on(DUEL, function(data) {

    if (openBattles.length > 0) {
      var battle = openBattles.pop();
      battle.addCombatant(socket);
      var battleId = battle.getId();
      battles[battleId] = battle;
      battle.sockets.map(function(sock) {
        sock.getBattle = function() { return battles[socket.battleId]; };
      });
      io.emit(BEGIN);
    } else {
      openBattles.push(new Battle(socket));
    }
  });

  socket.on(ATTACK_PU, function(data) {
    var attackId = data.attackId;
    socket.getBattle().startAttack(attackId);
    socket.broadcast.emit(ATTACK_PU, {attackId: attackId});
  });

  socket.on(PERRY, function(data) {
    socket.getBattle().perryAttack(data);
  });

  socket.on(REPOST, function(data) {
    socket.getBattle().counterAttack();
    console.log(data);
  });

  socket.on(ATTACK, function(data) {
    var resolution = socket.getBattle().resolveAttack(data);
    io.emit(RESOLVE_ATTACK, resolution);
  });

  socket.on('disconnect', function() {
    io.emit('disconnect');
  });

});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
