/* globals angular */
var Magic = require('./Magic');

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

  $scope.attacks = Magic.spellList.attacks;
  $scope.enhancers = Magic.spellList.counters;
  $scope.counters = Magic.spellList.enhancers;
  // set counterspells to disabled
  //avatar.disableCounterSpells()

  $scope.initializeSpell = function (spell) {
    avatar.disableAttackSpells();
    avatar.disableCounterSpells();
    if (spell.type === 'Attack') { // initialize the attack cycle
      spell = socket.attackWith(spell);
    }
    spell.initTime = new Date().getTime()
    $scope.castingSpell = true;
    socket.castingSpell = true;
    // Inspect spell
    $scope.spell = spell
  };

  $scope.finalizeSpell = function(spell) {
    spell.finalTime = new Date().getTime();
    $scope.castingSpell = false;
    socket.castingSpell = false;
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
          var defensiveSpell = Magic.castSpell(attackId)
          socket.emit(E.PERRY, defensiveSpell);
        break;
      case 'Repost':
          var repostSpell = Magic.castSpell(attackId)
          socket.emit(E.REPOST, repostSpell);
        break;

      case 'Attack':
          var attackSpell = Magic.castSpell(attack);
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



} // Spells controller
