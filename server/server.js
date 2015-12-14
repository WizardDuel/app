var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Battle = require('./lib/Battle');

var _ = require('lodash');

var E = require('./lib/events.js');

app.use(express.static(__dirname + '/public'));

// Battle State
var battles = {};
var openBattles = []

io.on('connection', function(socket) {
  var battle = null;
  io.sockets.connected[socket.id].emit('id', socket.id);
  socket.on(E.DUEL, function(data) {
    if (openBattles.length > 0) {
      battle = openBattles.pop();
      battle.addCombatant(socket);
      battle.setFoesForDuel();
      io.to(battle.id).emit(E.BEGIN);
    } else {
      battle = new Battle(socket);
      openBattles.push(battle);
    }
  });

  socket.on(E.ATTACK_PU, function(attackData) {
    battle.startAttack(attackData);

    socket.to(battle.id).broadcast.emit(E.ATTACK_PU, {
      attackId: attackData.attackId,
      targetId: attackData.targetId
    });
  });

  socket.on(E.PERRY, function(data) {
    battle.perryAttack(data);
  });

  socket.on(E.REPOST, function(data) {
    battle.counterAttack();
  });

  socket.on(E.ATTACK, function(data) {
    var resolution = battle.resolveAttack(data);
    console.log('=============================')
    io.to(battle.id).emit(E.RESOLVE_ATTACK, resolution)
  });

  socket.on('disconnect', function() {
    io.emit('disconnect');
  });

});

http.listen(3000, function() {
  console.log('listening on *:3000')
});
