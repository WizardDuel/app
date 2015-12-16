/* globals angular */

module.exports = angular.module('wizardApp.spells', [
  // require('../spinner/spinner.js')
  // 'wizardApp.socketIO'
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

  .controller('SpellsCtrl', ['$scope', '$timeout', 'socketIO', SpellsCtrl])

  .directive('spinner', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: './views/components/spells/spinner.html',
      controller: 'SpellsCtrl'
    };
  })

  .name;

function SpellsCtrl($scope, $timeout, socketIO) {
  var E = socketIO.E;
  var socket = socketIO.socket;

  $scope.castingSpell = false;

  $scope.initializeSpell = function (spellName) {
    $scope.spellData = {
      name: spellName,
      initTime: new Date().getTime()
    };
    $scope.castingSpell = true;
  };

  $scope.finalizeSpell = function(spellData) {
    $scope.spellData.finalTime = new Date().getTime();
    $scope.castingSpell = false;
    $scope.castSpell($scope.spellData);
  };

  $scope.castSpell = function(spellData) {
    console.log('cast spell')
    console.log('mana:', socket.mana)
    socket.mana = Number(socket.mana) - Number(5);
    switch (spellData.name) {
      case 'Recover':

        break;

      case 'Defend':

        break;

      case 'Perry':
        if (socket.attack) {
          var defensiveSpell = magic.castSpell(socket.attack)
          socket.emit(E.PERRY, defensiveSpell);
        }
        break;
      case 'Repost':
        if (socket.attack) {
          var repostSpell = magic.castSpell(socket.attack)
          socket.emit(E.REPOST, repostSpell);
        }
        break;

      case 'Attack':
        var attackId = new Date().getTime();
        var foe = socket.getFoeId()
        var me = socket.id
        console.log('attack sent:', foe)
        console.log('me:', me)
        socket.emit(E.ATTACK_PU, {attackId: attackId, targetId: socket.getFoeId()});
        setTimeout(function() {
          var attackSpell = magic.castSpell(attackId);
          socket.emit(E.ATTACK, attackSpell)
        }, 400)
        break;
    }
  };
}

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
