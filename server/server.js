var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Battle = require('./lib/Battle');

var E = require('./lib/events.js');

app.use(express.static(__dirname + '/public'));

// Battle State
var battles = {};
var openBattles = [];

io.on('connection', function(socket) {
  console.log('io.sockets.connected keys: ', Object.keys(io.sockets.connected));
  var battle = null;
  socket.on(E.DUEL, function() {
    console.log('ACTIVE SOCKET ID: ', socket.id);
    if (openBattles.length > 0) {
      battle = openBattles.pop();
      battle.addCombatant(socket);
      console.log('Added combatant to open battle');
      console.log('battle: ', Object.keys(battle));
      console.log('battle.sockets ids: ', battle.sockets.map(function(e) { return e.id; }));
      battle.setFoesForDuel();
      console.log('battle.sockets[0].foeId: ', battle.sockets[0].foeId);
      console.log('battle.sockets[1].foeId: ', battle.sockets[1].foeId);
      console.log('io.sockets.connected[' + battle.sockets[1].foeId + '].rooms: ', io.sockets.connected[battle.sockets[1].foeId].rooms);
      console.log('io.sockets.connected[' + battle.sockets[0].foeId + '].rooms: ', io.sockets.connected[battle.sockets[0].foeId].rooms);
      io.to(battle.id).emit(E.BEGIN);
    } else {
      battle = new Battle(socket);
      console.log('New battle: ', Object.keys(battle), '    battle.id: ', battle.id);
      console.log('battle.sockets ids: ', battle.sockets.map(function(e) { return e.id; }));
      console.log('io.sockets.connected[' + socket.id + '].rooms: ', io.sockets.connected[socket.id].rooms);
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
  console.log('listening on *:3000');
});
