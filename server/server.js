<<<<<<< HEAD
=======
// var express = require('express');
// var http = require('http');
//
// var app = express();
// var server = http.Server(app);
//
// var socketIO = require('socket.io');
// var io = socketIO(server);
//
// var path = require('path');
//
// app.use(express.static(path.join(__dirname, '..', 'client/www')));
//
// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, '..', 'client/www/index.html'));
// });
//
// server.listen(3000, function () {
//   console.log('listening on port 3000 ...');
// });

>>>>>>> 723e6f4d77f8a5419aea236890fe589099993e7e
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Battle = require('./lib/Battle');

<<<<<<< HEAD
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
var ATTACK = 'Attack';

// Battle State
var battles = {};
var openBattles = []

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
=======
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

  socket.on(E.ATTACK_PU, function(data) {
    battle.startAttack(data.attackId, data.targetId);
    socket.broadcast.emit(E.ATTACK_PU, {
      attackId: data.attackId,
      targetId: data.targetId
    });
  });

  socket.on(E.PERRY, function(data) {
    socket.getBattle().perryAttack(data);
  });

  socket.on(E.REPOST, function(data) {
>>>>>>> 723e6f4d77f8a5419aea236890fe589099993e7e
    socket.getBattle().counterAttack();
    console.log(data);
  });

<<<<<<< HEAD
  socket.on(ATTACK, function(data) {
    var resolution = socket.getBattle().resolveAttack(data);
    io.emit(RESOLVE_ATTACK, resolution);
=======
  socket.on(E.ATTACK, function(data) {
    console.log('attack received');
    var resolution = battle.resolveAttack(data);
    io.emit(E.RESOLVE_ATTACK, resolution);
>>>>>>> 723e6f4d77f8a5419aea236890fe589099993e7e
  });

  socket.on('disconnect', function() {
    io.emit('disconnect');
  });

});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
