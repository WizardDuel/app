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
  $scope.counters = Magic.spellList.counters;
  $scope.enhancers = Magic.spellList.enhancers;

  $scope.initializeSpell = function (spell) {
    if (spell.role !== 'enhancer') {
      avatar.disableAttackSpells();
      avatar.disableCounterSpells();
      if (spell.type === 'attack') { // initialize the attack cycle
        spell = socket.attackWith(spell);
      }
      spell.initTime = new Date().getTime()
      $scope.castingSpell = true;
      socket.castingSpell = true;
      // Inspect spell
      $scope.spell = spell
      console.log(spell)
    } else {
      var enhanceSpell = Magic.castEnhancer(spell, socket.id);
      socket.emit(E.ENHANCE, enhanceSpell);
    }

  };

  $scope.finalizeSpell = function(spell) {
    spell.finalTime = new Date().getTime();
    $scope.castingSpell = false;
    socket.castingSpell = false;
    $scope.castSpell(spell);
  };

  $scope.castSpell = function(spell) {
    switch (spell.type) {
      case 'perry':
          var defensiveSpell = Magic.castSpell(socket.incomingSpell.attackId)
          socket.emit(E.PERRY, defensiveSpell);
          avatar.resetSpells(socket)
          socket.incomingSpell = null;
          avatar.flashMessage('-'+spell.cost+' mana')
        break;
      case 'repost':
          var repostSpell = Magic.castSpell(socket.incomingSpell.attackId)
          socket.emit(E.REPOST, repostSpell);
          avatar.resetSpells(socket)
          socket.incomingSpell = null
          avatar.flashMessage('-'+spell.cost+' mana')
        break;

      case 'attack':
          var attackSpell = Magic.castSpell({attackId: spell.attackId, spellName: spell.name});
          socket.emit(E.ATTACK, attackSpell);
          avatar.flashMessage('-'+spell.cost+' mana')
        break;
    }
  };

  socket.on(E.ATTACK_PU, function(data) {
    if (data.targetId === socket.id) avatar.enableCounterSpells()
    avatars[data.casterId].addClass('purple');
    setTimeout(function(){ avatars[data.casterId].removeClass('purple') }, 1500)
  });



} // Spells controller
