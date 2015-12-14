var uuid = require('node-uuid');

function Battle(socket) {
  this.id = uuid.v4();
  this.sockets = [];
  this.addCombatant(socket);
  this.attacks = {};
}

Battle.prototype.addCombatant = function(socket) {
  this[socket.id] = {};
  socket.join(this.id);
  this.sockets.push(socket);
};

Battle.prototype.setFoesForDuel = function() {
  if (this.sockets.length !== 2) throw new Error('Invalid number of combatants');
  this.sockets[1].foeId = this.sockets[0].id;
  this.sockets[0].foeId = this.sockets[1].id;
};

Battle.prototype.startAttack = function(attackData) {
  console.log('start attack:', attackData);
  this.attacks[attackData.attackId] = {targetId:attackData.targetId};
  console.log(this.attacks);
};

Battle.prototype.perryAttack = function(data) {
  console.log('register perry');
  if (!this.attacks[data.attackId]) this.attacks[data.attackId] = {};
  this.attacks[data.attackId].counterSpell = {spell: data};
  this.attacks[data.attackId].counterSpell.spell.type = 'perry';
};

Battle.prototype.counterAttack = function() {};

Battle.prototype.resolveAttack = function(attackSpell) {
  console.log('resolve attack');
  var resolution = [];
  var attack = this.attacks[attackSpell.attackId];
  console.log('attack:', attack);
  var counterSpell = null;
  if (attack.counterSpell) counterSpell = attack.counterSpell.spell;
  if (counterSpell) console.log('counter spell:', counterSpell);
  if (counterSpell && counterSpell.time < attackSpell.time) {
    switch (counterSpell.type) {
      case 'perry':
        resolution.push({
          targetId: attack.targetId,
          damage: this.resolveCrit(attackSpell, counterSpell),
          msg: 'Attack perried!'
        });
        break;
      case 'repost':
        break;
    }
  } else {
    console.log('Full attack');
    resolution.push({targetId: attack.targetId, damage:attackSpell.power});
  }
  console.log('msg:', attackSpell.msg);
  console.log('resolution:', resolution);
  return resolution;
};
Battle.prototype.resolveCrit = function(attackSpell, counterSpell) {
  var outcome = null;
  switch (counterSpell.crit) {
    case -1:
      outcome = this.critSwitch(attackSpell.crit, 0, attackSpell.power, 12);
      break;
    case 0:
      outcome = this.critSwitch(attackSpell.crit, 0, attackSpell.power - counterSpell.power, 12);
      break;
    case 1:
      outcome = this.critSwitch(attackSpell.crit, 0, 0, 0);
      break;
  }
  return outcome;
};

Battle.prototype.critSwitch = function(crit, neg, zero, one) {
  var outcome = null;
  switch (crit) {
    case -1:
      outcome = neg;
      break;
    case 0:
      outcome = zero;
      break;
    case 1:
      outcome = one;
      break;
  }
  return outcome;
};
module.exports = Battle;
