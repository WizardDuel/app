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

  .directive('spinner', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: './views/components/spells/spinner.html',
      controller: 'SpellsCtrl'
    };
  })

  .directive('spellPanel', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        spellList: '=spellList'
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
    if (data.targetId === socket.id) avatar.enableCounterSpells()
    avatars[data.casterId].addClass('purple');
    setTimeout(function(){ avatars[data.casterId].removeClass('purple') }, 500)
  });

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
