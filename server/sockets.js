module.exports = function(io) {
  var Battle = require('./lib/Battle');
  var E = require('./lib/events.js');

  // Battle State
  var battles = {};
  var openBattles = [];

  io.on('connection', function(socket) {
    var battle = null;
    socket.on(E.DUEL, function() {
      if (openBattles.length > 0) {
        battle = openBattles.pop();
        battle.addCombatant(socket);
        battle.setFoesForDuel();
        console.log('begin: ', battle.wizStats())
        io.to(battle.id).emit(E.BEGIN, {condition: 'Battle', wizStats: battle.wizStats()});
      } else {
        battle = new Battle(socket);
        openBattles.push(battle);
      }
    });

    socket.on(E.ATTACK_PU, function(attackData) {
      attackData.casterId = socket.id;
      battle.startAttack(attackData);

      socket.to(battle.id).broadcast.emit(E.ATTACK_PU, attackData);
    });

    socket.on(E.PERRY, function(data) {
      battle.perryAttack(data);
    });

    socket.on(E.REPOST, function(data) {
      battle.counterAttack(data);
    });

    socket.on(E.ATTACK, function(data) {
      setTimeout(function(){
        var resolution = battle.resolveAttack(data);
        if (resolution.condition === 'Victory') {
          io.to(battle.id).emit(E.RESOLVE_ATTACK, resolution)
          battle.sockets.map(function(sock) {
            io.to(battle.id).emit('End of battle')
            io.sockets.connected[sock.id].emit('disconnect');

          })
        }
        io.to(battle.id).emit(E.RESOLVE_ATTACK, resolution);
        console.log('=============================');
      }, 100);

    });

    socket.on('disconnect', function() {
      //io.to(battle.id).emit('End of battle', 'opponent disconnected')
      io.emit('disconnect');
    });
  });
};
