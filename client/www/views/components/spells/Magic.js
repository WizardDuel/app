var Magic = {
  setPower: function() {return Math.floor(Math.random() * 10 + 1);},
  setCrit: function() {
    var roll = Math.floor(Math.random() * 20 + 1);
    var crit = null;
    if (roll > 17) return 1;
    if (roll < 3) return -1;
    return 0;
  },
  setTime: function() {return new Date().getTime();},

  castSpell: function(attack, power, crit, timeShift) {
    var spell = {
      attackId: attack.attackId,
      power: power ? power : this.setPower(),
      crit: crit !== null ? crit : this.setCrit(),
      time: this.setTime() + timeShift,
      spellName: attack.spellName
    };
    return spell;
  },
  castEnhancer: function(spell, target) {
    var effect = {
      casterId: target,
      target: target,
      name: spell.name,
      effect: spell.type,
      power: spell.power,
      sideEffects: spell.sideEffects,
      cost: spell.cost,
    }
    return effect
  },
  spellList: {
    attacks: [
      { name: 'Magic Missile', type: 'attack', target: 'foe', role: 'attack', afinity: 'basic', cost: 5},
      {name: 'Water Coffin', type: 'attack', target: 'foe', role: 'attack', afinity: 'water', cost: 7},
      {name: 'Wind Swords', type: 'attack', target: 'foe', role: 'attack', afinity:'air', cost: 7},
    ],
    counters: [

      { name: 'Warp spacetime', icon: 'ion-android-favorite-outline', type: 'perry', target: 'foe', role: 'counter', afinity: 'basic', cost: 5 },
      { name: 'Mystical Judo', icon: 'ion-ios-plus-outline', type: 'repost', target: 'foe', role: 'counter', afinity: 'basic', cost: 6 },
    ],
    enhancers: [
      {name: 'Heal', icon: 'ion-heart', type: 'recover-health', target: 'caster', role: 'enhancer', afinity: 'basic', cost: 5, power: 5},
      {name: 'Force Armor', icon: 'ion-ios-plus-outline', type: 'buff-health', target: 'caster', role:'enhancer', afinity:'basic', cost: 5, duration:20},
    ]
  }
};

module.exports = Magic;
