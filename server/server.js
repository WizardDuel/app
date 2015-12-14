var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Battle = require('./lib/Battle');

// <<<<<<< HEAD
// app.use(express.static(__dirname + '/public'));

// // Events
// var DUEL = 'Duel';
// var BEGIN = 'Begin'
// var CHAT_MSG = 'chat message';
// var NEW_USR = 'new user';
// var ATTACK_PU = 'Attack Power Up';
// var RESOLVE_ATTACK = 'Resolve Attack';
// var PERRY = 'Perry';
// var REPOST = 'Repost'
// var RECOVER = 'Recover';
// var DEFEND = 'Defend';
// var WIZ_ID = 'Wizard Id';
// var ATTACK = 'Attack';

// // Battle State
// var battles = {};
// var openBattles = []

// io.on('connection', function(socket) {

//   io.sockets.connected[socket.id].emit('id', socket.id);

//   socket.on(DUEL, function(data) {

//     if (openBattles.length > 0) {
//       var battle = openBattles.pop();
//       battle.addCombatant(socket);
//       var battleId = battle.getId();
//       battles[battleId] = battle;
//       battle.sockets.map(function(sock) {
//         sock.getBattle = function() { return battles[socket.battleId]; };
//       });
//       io.emit(BEGIN);
//     } else {
//       openBattles.push(new Battle(socket));
//     }
//   });

//   socket.on(ATTACK_PU, function(data) {
//     var attackId = data.attackId;
//     socket.getBattle().startAttack(attackId);
//     socket.broadcast.emit(ATTACK_PU, {attackId: attackId});
//   });

//   socket.on(PERRY, function(data) {
//     socket.getBattle().perryAttack(data);
//   });

//   socket.on(REPOST, function(data) {
// =======
var _ = require('lodash');
var path = require('path');

var E = require('./lib/events.js');

app.use(express.static(path.join(__dirname, '..', 'client/www')));

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
    console.log('=============================');
    io.to(battle.id).emit(E.RESOLVE_ATTACK, resolution);
  });

  socket.on('disconnect', function() {
    io.emit('disconnect');
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
