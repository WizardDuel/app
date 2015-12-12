function Battle(id) {
  this[id] = {};
}

Battle.prototype.addCombatant = function(id) {
  this[id] = {};
};

module.exports = Battle;
