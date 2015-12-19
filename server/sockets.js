module.exports = function(io) {
  var Battle = require('./lib/Battle');
  var E = require('./lib/events.js');
  var _ = require('lodash');

  // Battle State
  var openBattles = [];


  io.on('connection', function(socket) {
    var battle = null;

    function regenerateMana(){
      battle.manaRegen(function() {
        io.to(battle.id).emit(E.MANA_REGEN, battle.wizStats());
      });
    }

    socket.once(E.DUEL, function() {

      if (openBattles.length > 0) {
        battle = openBattles.pop();
        battle.addCombatant(socket);
        battle.setFoesForDuel();
        console.log('begin: ', battle.wizStats())
        io.to(battle.id).emit(E.BEGIN, {condition: 'Battle', wizStats: battle.wizStats()});
      } else {
        battle = new Battle(socket);
        openBattles.push(battle);
        io.sockets.connected[socket.id].emit('waiting for opponent');
      }
    });

    socket.on(E.READY, function(socket){
      if(++battle.readyCount === battle.sockets.length){
        io.to(battle.id).emit(E.START);
        setInterval(regenerateMana, 7000);
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
          clearInterval(regenerateMana);
          battle.sockets.map(function(sock) {
            var msg = null;
            if (sock.id === resolution.winner) {
               msg = 'you win!'
            } else {
              msg = 'you lose :('
            }
            io.sockets.connected[sock.id].emit('End of battle', msg);
          })
        } else {
          io.to(battle.id).emit(E.RESOLVE_ATTACK, resolution);
          console.log('=============================');
        }
      }, 100);
    });

    socket.on(E.ENHANCE, function(spell) {
      var updates = battle.resolveEnhance(spell)
      io.to(battle.id).emit(E.UPDATE, updates)
    });

    socket.on('disconnect', function() {
      console.log('disconnect')
      if (battle) {
        io.to(battle.id).emit('End of battle', 'opponent disconnected');
        if (_.includes(_.pluck(openBattles, 'id'), battle.id) ){
          openBattles = openBattles.filter(function(btl) {
            return btl.id !== battle.id;
          });
        }
      }
      io.emit('disconnect');
    });

    socket.on('error', function(err){
      console.log(err);
    });
  });
};
