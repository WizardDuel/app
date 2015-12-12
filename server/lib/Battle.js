function Battle(socket) {
  this.sockets = [];
  this.addCombatant(socket);
  this.attacks = [];
}

Battle.prototype.addCombatant = function(socket) {
  this[socket.id] = {}
  this.sockets.push(socket)
}

Battle.prototype.id = function() {
  if (!this.id) {
    this.id = sockets.reduce(function(a, b) {
      return a + b
    })
    sockets.map(function(socket) {
      socket.battleId = this.id
    })
  }
  return this.id
}

module.exports = Battle;
