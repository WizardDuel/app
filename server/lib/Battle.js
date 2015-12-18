var uuid = require('node-uuid');

function Battle(socket) {
  this.id = uuid.v4();
  this.sockets = [];
  this.addCombatant(socket);
  this.attacks = {};
  this.readyCount = 0;
}

Battle.prototype.addCombatant = function(socket) {
  this[socket.id] = socket;
  socket.join(this.id);
  this.sockets.push(socket);
  socket.health = socket.mana = 100;
};

Battle.prototype.setFoesForDuel = function() {
  if (this.sockets.length !== 2) throw new Error('Invalid number of combatants');
  this.sockets[1].foeId = this.sockets[0].id;
  this.sockets[0].foeId = this.sockets[1].id;
  //return [this.sockets[0], this.sockets[1]]
};

Battle.prototype.startAttack = function(attackData) {
  console.log('start attack:', attackData);
  this.attacks[attackData.attackId] = {targetId:attackData.targetId, casterId: attackData.casterId};
  console.log(this.attacks);
};

Battle.prototype.perryAttack = function(data) {
  console.log('register perry');
  if (!this.attacks[data.attackId]) this.attacks[data.attackId] = {};
  this.attacks[data.attackId].counterSpell = {spell: data};
  this.attacks[data.attackId].counterSpell.spell.type = 'perry';
};

Battle.prototype.counterAttack = function(spell) {
  if (!this.attacks[spell.attackId]) this.attacks[spell.attackId] = {};
  this.attacks[spell.attackId].counterSpell = {spell: spell};
  this.attacks[spell.attackId].counterSpell.spell.type = 'repost';
};

Battle.prototype.resolveAttack = function(attackSpell) {
  console.log('resolve attack:', attackSpell)
  // get spells
  var resolution = {};
  var attack = this.attacks[attackSpell.attackId];
  if (attack.counterSpell) var counterSpell = attack.counterSpell.spell;

  if (counterSpell && counterSpell.time < attackSpell.time) {
    switch (counterSpell.type) {
      case 'perry':
        console.log('perry, attackspell:', attackSpell)
        resolution = this.resolvePerry(attack, counterSpell, attackSpell);
        break;
      case 'repost':
        resolution = this.resolveRepost(attack, counterSpell, attackSpell);
        break;
    }
  } else {
    resolution = {targetId: attack.targetId, spellName: attackSpell.spellName, damage: attackSpell.power, casterId: attack.casterId};
  }
  return this.applyResolution(resolution)
};

Battle.prototype.resolvePerry = function(attack, counterSpell, attackSpell) {
  return {
    targetId: attack.targetId,
    spellName: attackSpell.spellName,
    damage: this.resolveCrit(attackSpell, counterSpell),
    msg: 'Attack perried!',
    counterCasterId: attack.targetId,
    casterId: attack.casterId,
  }
}

Battle.prototype.resolveCrit = function(attackSpell, counterSpell) {
  console.log('attackspell:',attackSpell)
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

Battle.prototype.resolveRepost = function(attack, counterSpell, attackSpell){
  var msg = [
    'succefully parried attack, but missed counter!',
    'Critical hit!',
    'Repost!',
  ];
  var response = {
    targetId: attack.targetId,
    spellName: attackSpell.spellName,
    damage: 0,
    msg: msg[0]
  }

  if (counterSpell.repost)
      switch(counterSpell.crit) {
        case -1:
          break;
        case 0:
          response.targetId = this.critSwitch(attackSpell.crit, attack.casterId, attack.casterId, attack.targetId)
          response.damage = this.critSwitch(attackSpell.crit, counterSpell.power, counterSpell.power, 12);
          response.msg = this.critSwitch(attackSpell.crit, msg[3], msg[3], msg[2])
          break;
        case 1:
          response.targetId = attack.casterId;
          response.damage = 12;
          response.msg = [msg[2], msg[3]].join(' ')
  }
  response.counterCasterId = attack.targetId;
  response.casterId = attack.casterId;
  return response;
};

Battle.prototype.applyResolution = function(resolution) {
  console.log('apply resolution:', resolution)
  this[resolution.targetId].health -= resolution.damage;
  this[resolution.casterId].mana -= 5;
  if (resolution.counterCaster) this[resolution.counterCasterId].mana -= 5;

  this.sockets.map(function(wiz) {
    if (wiz.mana <= 0) wiz.mana = 0;
  })
  console.log('health: ' + this.sockets[0].health + ' -- ' + this.sockets[1].health)
  if (this.sockets[0].health <= 0 || this.sockets[1].health <= 0) {
    var winner = this.sockets.filter(function(sk) {return sk.health > 0})[0]
    return {condition:'Victory', wizStats:this.wizStats(), winner:winner, targetId: resolution.targetId, casterId: resolution.casterId, spellName: resolution.spellName}
  } else {
    return {condition: 'Battle', wizStats:this.wizStats(), targetId: resolution.targetId, casterId: resolution.casterId, spellName: resolution.spellName}
  }
}

Battle.prototype.wizStats = function() {
  var obj = {}
  this.sockets.map(function(sock) {
    obj[sock.id] = {health: sock.health, mana: sock.mana}
  });
  return obj;
}

Battle.prototype.manaRegen = function(callback) {
  this.sockets.map(function(wiz) {
    if(wiz.mana < 100) wiz.mana += 5;
  });
  callback();
};

module.exports = Battle;
