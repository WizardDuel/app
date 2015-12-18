/* globals angular */

module.exports = angular.module('wizardApp.spells', [

  ])
  .directive('spells', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        spells: '=',
      },
      templateUrl: './views/components/spells/spells.html',
      controller: 'SpellsCtrl'
    };
  })

  .directive('powerBar', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: './views/components/spells/powerBar.html',
      controller: 'SpellsCtrl'
    };
  })

  .directive('spellPanel', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        spellList: '=list'
      },
      templateUrl: './views/components/spells/spellPanel.html',
      controller: 'SpellsCtrl'
    }
  })

  .controller('SpellsCtrl', ['$scope', '$timeout', 'socketIO', SpellsCtrl])

  .name;

function SpellsCtrl($scope, $timeout, socketIO) {
  // set initial values for magic casting
  var E = socketIO.E;
  var socket = socketIO.socket;
  $scope.castingSpell = false; // shows powerbar when true
  // gain access to the world
  var avatars = socket.avatars
  var avatar = socket.avatars[socket.id]
  $scope.self = socket.id
  // set counterspells to disabled
  avatar.disableCounterSpells()

  $scope.initializeSpell = function (spell) {
    avatar.disableAttackSpells();
    avatar.disableCounterSpells();
    if (spell.type === 'Attack') { // initialize the attack cycle
      spell = socket.attackWith(spell);
    }
    spell.initTime = new Date().getTime()
    $scope.castingSpell = true;
    // Inspect spell
    $scope.spell = spell
  };

  $scope.finalizeSpell = function(spell) {
    spell.finalTime = new Date().getTime();
    $scope.castingSpell = false;
    $scope.castSpell(spell);
  };

  $scope.castSpell = function(spell) {
    var attackId = spell.attackId;
    var attack = {
      attackId: attackId,
      spellName: spell.name
    };

    switch (spell.type) {
      case 'Recover':
        break;
      case 'Defend':
        break;
      case 'Perry':
          var defensiveSpell = magic.castSpell(attackId)
          socket.emit(E.PERRY, defensiveSpell);
        break;
      case 'Repost':
          var repostSpell = magic.castSpell(attackId)
          socket.emit(E.REPOST, repostSpell);
        break;

      case 'Attack':
          var attackSpell = magic.castSpell(attack);
          socket.emit(E.ATTACK, attackSpell);
          document.getElementById(socket.id + '-spell-message').innerHTML = '-# mana';
          setTimeout(function() { document.getElementById(socket.id + '-spell-message').innerHTML = '' }, 1500);
        break;
    }
  };

  socket.on(E.ATTACK_PU, function(data) {
    if (data.targetId === socket.id) avatar.enableCounterSpells()
    avatars[data.casterId].addClass('purple');
    setTimeout(function(){ avatars[data.casterId].removeClass('purple') }, 1500)
  });

  $scope.AttackSpells = [
    { name: 'Magic Missile', type: 'Attack', target: 'foe', role: 'attack', afinity: 'basic', cost: 5},
    {name: 'Water Coffin', type: 'Attack', target: 'foe', role: 'attack', afinity: 'water', cost: 7},
    {name: 'Wind Swords', type: 'Attack', target: 'foe', role: 'attack', afinity:'air', cost: 7},
  ]
  $scope.nonAttackSpells  = [
    {name: 'Heal', icon: 'ion-heart', type: 'recovery', target: 'caster', role: 'heal', afinity: 'basic', cost: 5, power: 5},
    {name: 'Force Armor', icon: 'ion-ios-plus-outline', type: 'buff', target: 'caster', role:'buff', afinity:'basic', cost: 5, duration: 15},
    { name: 'Warp spacetime', icon: 'ion-android-favorite-outline', type: 'Perry', target: 'foe', role: 'perry', afinity: 'basic', cost: 5 },
    { name: 'Mystical Judo', icon: 'ion-ios-plus-outline', type: 'Repost', target: 'foe', role: 'repost', afinity: 'basic', cost: 6 },
  ]

} // Spells controller

var magic = {
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
};
