var uuid = require('node-uuid');

function Battle(socket) {
  this.id = uuid.v4();
  this.sockets = [];
  this.addCombatant(socket);
  this.attacks = {};
}

Battle.prototype.addCombatant = function(socket) {
  this[socket.id] = {}
  socket.join(this.id);
  this.sockets.push(socket)
}

Battle.prototype.startAttack = function(data) {
  this.attacks[data] = {};
  return data.attackId;
}

Battle.prototype.perryAttack = function(data) {
  var attack = this.attacks[data.attackId];
  attack.response = data;
}
Battle.prototype.counterAttack = function() {}

Battle.prototype.resolveAttack = function(attackData) {
  var attack = this.attacks[attackData.attackId]
  var resolution = {}
  if (attack.response && attack.response.time < attackData.time) {
    resolution.attack = attackData;
    resolution.response = attack.response;
  } else {
    resolution = attackData;
  }
  return resolution
}

module.exports = Battle;
