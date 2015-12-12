
function Battle(socket) {
  this.sockets = [];
  this.addCombatant(socket);
  this.attacks = {};
}

Battle.prototype.addCombatant = function(socket) {
  this[socket.id] = {}
  this.sockets.push(socket)
}

Battle.prototype.getId = function() {
  if (!this.id) {
    this.id = this.sockets[0].id + this.sockets[1].id;
    this.sockets[0].battleId = this.sockets[1].battleId = this.id;

    // this will need to be updated for group battles
    this.sockets[0].foeId = this.sockets[1].id
    this.sockets[1].foeId = this.sockets[0].id
  }
  return this.id
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
