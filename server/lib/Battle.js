var uuid = require('node-uuid');

function Battle(socket) {
  this.id = uuid.v4();
  this.sockets = [];
  this.addCombatant(socket);
  this.attacks = {};
}

Battle.prototype.addCombatant = function(socket) {
  this[socket.id] = {};
  socket.join(this.id); // battle room appears to be updated with newly joined socket id AFTER the E.DUEL listener's callback finishes
  this.sockets.push(socket);
}

Battle.prototype.setFoesForDuel = function() {
  if (this.sockets.length !== 2) throw new Error('Invalid number of combatants');
  this.sockets[1].foeId = this.sockets[0].id;
  this.sockets[0].foeId = this.sockets[1].id;
}

Battle.prototype.startAttack = function(attackId,targetId) {
  this.attacks[attackId] = {targetId:targetId};
}

Battle.prototype.perryAttack = function(data) {
  var attack = this.attacks[data.attackId];
  attack.response = data;
}
Battle.prototype.counterAttack = function() {}

Battle.prototype.resolveAttack = function(attackData) {
  var resolution = [];
  var attack = this.attacks[attackData.attackId];
  if (attack.response && attack.response.time < attackData.time) {
  //   resolution.attack = attackData;
  //   resolution.response = attack.response;
  } else {
    resolution.push({targetId: attack.targetId, damage:attackData.power})
  }
  return resolution
}

module.exports = Battle;
