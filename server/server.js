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

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Battle = require('./lib/Battle');

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
    socket.getBattle().counterAttack();
    console.log(data);
  });

  socket.on(E.ATTACK, function(data) {
    console.log('attack received');
    var resolution = battle.resolveAttack(data);
    io.emit(E.RESOLVE_ATTACK, resolution);
  });

  socket.on('disconnect', function() {
    io.emit('disconnect');
  });

});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
