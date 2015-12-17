/* globals angular */
var _ = require('lodash')

module.exports = angular.module('wizardApp.spells', [
  ])

  .directive('spells', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: './views/components/spells/spells.html',
      controller: 'SpellsCtrl'
    };
  })

  .directive('spinner', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        castingSpell: '=',
      },
      templateUrl: './views/components/spells/spinner.html',
      controller: 'SpellsCtrl'
    };
  })

  .directive('spellPanel', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        spellList: '=spells',
      },
      templateUrl: './views/components/spells/spellPanel.html',
      controller: 'SpellsCtrl',
    }
  })

  .directive('status', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: './views/components/spells/status.html'
    }
  })

  .directive('updates', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: './views/components/spells/updates.html'
    }
  })

  .controller('SpellsCtrl', ['$scope', '$timeout', 'socketIO', SpellsCtrl])
  .name;

function SpellsCtrl($scope, $timeout, socketIO) {
  // set initial values for magic casting
  var E = socketIO.E;
  var socket = socketIO.socket;
  $scope.castingSpell = false; // shows powerbar when true

  // gain access to the world for event updates
  var avatar = socket.avatars[socket.id]

  // set counterspells to disabled
  console.log('spells controller')
  avatar.disableSpells('Repost')
  avatar.disableSpells('Perry')

  $scope.initializeSpell = function (spell) {
    console.group('init Spell')
    console.log(spell)
    console.log()

    $scope.castingSpell = true;
    console.log('casting spell', $scope.castingSpell)

    avatar.disableSpells('Attack');
    avatar.disableSpells('Perry');
    avatar.disableSpells('Repost')
    if (spell.type === 'Attack') { // initialize the attack cycle
      spell = socket.attackWith(spell);
    }
    spell.initTime = new Date().getTime()
    // Inspect spell
    $scope.spell = spell
    console.log('scope.spell', $scope.spell)
    console.groupEnd()
  };

  $scope.finalizeSpell = function(spell) {
    console.group('finalizeSpell')
    console.log('scope.spell', $scope.spell);
    console.log(spell)
    spell.finalTime = new Date().getTime();
    $scope.castingSpell = false;
    $scope.castSpell(spell);
    console.groupEnd()
  };

  $scope.castSpell = function(spell) {
    var attackId = spell.attackId

    console.log('cast spell')

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
          var attackSpell = magic.castSpell(attackId);
          socket.emit(E.ATTACK, attackSpell)
        break;
    }
  };

  socket.on(E.ATTACK_PU, function(data) {
    if (data.targetId === socket.id) avatar.enableSpells('Counter')
    socket.avatars[data.casterId].addClass('purple');
    setTimeout(function(){ socket.avatars[data.casterId].removeClass('purple') }, 500)
  });

  $scope.myId = socket.id;

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

  // add style attributes
  $scope.AttackSpells = $scope.AttackSpells.map(function(spell) {
    spell.classesToAdd = 'button-assertive'
    return spell
  })

  $scope.nonAttackSpells = $scope.nonAttackSpells.map(function(spell) {
    switch(spell.role) {
      case 'perry':
          spell.classesToAdd = 'button-positive'
        break;
      case 'repost':
        spell.classesToAdd = 'button-balanced'
        break;
      case 'heal':
        spell.classesToAdd = 'button-assertive button-outline'
        break;
      case 'buff':
        spell.classesToAdd = 'button-positive button-outline'
        break;
    }
    return spell
  })

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
      attackId: attack,
      power: power ? power : this.setPower(),
      crit: crit !== null ? crit : this.setCrit(),
      time: this.setTime() + timeShift,
    };
    return spell;
  },
};
