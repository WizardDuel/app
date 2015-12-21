// var powerBar = require('../power-bar/powerBar.js');
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
  .directive('spellPanel', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        spellList: '=list'
      },
      templateUrl: './views/components/spells/spellPanel.html',
      controller: 'SpellsCtrl'
    };
  })
  .directive('powerBar', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: './views/components/power-bar/powerBar.html',
      controller: 'SpellsCtrl'
    };
  })

  .controller('SpellsCtrl', ['$scope', '$timeout', '$interval', 'socketIO', SpellsCtrl])

  .name;

function SpellsCtrl($scope, $timeout, $interval, socketIO) {
  // set initial values for magic casting
  var E = socketIO.E;
  var socket = socketIO.socket;
  $scope.castingSpell = false; // shows powerbar when true

  // gain access to the world
  var avatars = socket.avatars;
  var avatar = socket.avatars[socket.id];
  $scope.self = socket.id;


  $scope.range = function(n) {
    return new Array(n);
  };

  $scope.$on('$destroy', function() {
    $scope.stopMeter();
  });

  $scope.attacks = Magic.spellList.attacks;
  $scope.counters = Magic.spellList.counters;
  $scope.enhancers = Magic.spellList.enhancers;

  $scope.initializeSpell = function (spell) {
    crit = false;

    if (spell.role !== 'enhancer') {
      intervalPromise = $interval(changeIndexClass, speed);
      avatar.disableSpellsBy('role', 'attack');
      avatar.disableSpellsBy('role', 'counter');
      if (spell.type === 'attack') { // initialize the attack cycle
        spell = socket.attackWith(spell);
      }
      spell.initTime = new Date().getTime();
      $scope.castingSpell = true;

      // Inspect spell
      $scope.spell = spell;
    } else {
      var enhanceSpell = Magic.castEnhancer(spell, socket.id);
      socket.emit(E.ENHANCE, enhanceSpell);
    }
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
      case 'perry':
          var defensiveSpell = Magic.castSpell(socket.incomingSpell.attackId, $scope.spellPower, $scope.crit);
          socket.emit(E.PERRY, defensiveSpell);
          avatar.resetSpells(socket);
          socket.incomingSpell = null;
          avatar.flashMessage('-'+spell.cost+' mana');
        break;
      case 'repost':
          var repostSpell = Magic.castSpell(socket.incomingSpell.attackId, $scope.spellPower, $scope.crit);
          socket.emit(E.REPOST, repostSpell);

          socket.incomingSpell = null;
          avatar.resetSpells(socket);
          avatar.flashMessage('-'+spell.cost+' mana');
        break;

      case 'attack':
          var attackSpell = Magic.castSpell({attackId: spell.attackId, spellName: spell.name}, $scope.spellPower, $scope.crit);
          console.log(attackSpell)
          console.log($scope.spellPower)
          socket.emit(E.ATTACK, attackSpell);
          avatar.flashMessage('-'+spell.cost+' mana');
        break;
    }
  };

  socket.on(E.ATTACK_PU, function(data) {
    socket.incomingSpell = data;
    avatar.enableSpellsBy('role', 'counter');
    avatar.showSpideySense();
  });

  $scope.AttackSpells = [
    { name: 'Magic Missile', type: 'Attack', target: 'foe', role: 'attack', afinity: 'basic', cost: 5},
    {name: 'Water Coffin', type: 'Attack', target: 'foe', role: 'attack', afinity: 'water', cost: 7},
    {name: 'Wind Swords', type: 'Attack', target: 'foe', role: 'attack', afinity:'air', cost: 7},
  ];
  $scope.nonAttackSpells  = [
    {name: 'Heal', icon: 'ion-heart', type: 'recovery', target: 'caster', role: 'heal', afinity: 'basic', cost: 5, power: 5},
    {name: 'Force Armor', icon: 'ion-ios-plus-outline', type: 'buff', target: 'caster', role:'buff', afinity:'basic', cost: 5, duration: 15},
    { name: 'Warp spacetime', icon: 'ion-android-favorite-outline', type: 'Perry', target: 'foe', role: 'perry', afinity: 'basic', cost: 5 },
    { name: 'Mystical Judo', icon: 'ion-ios-plus-outline', type: 'Repost', target: 'foe', role: 'repost', afinity: 'basic', cost: 6 },
  ];

//Power Bar Logic
  $scope.spellPower = 0;
  $scope.crit = 0;
  $scope.maxRange = 50;
  var critValue = 7;
  var speed = 7; //ms
  var index = $scope.maxRange;
  var lastIndex;
  var decrement = false;
  var intervalPromise;

  function changeIndexClass() {
    lastIndex = index;

    if(index === $scope.maxRange) decrement = true;
    if(index === 0) decrement = false;

    if(decrement) {
      $('#section-id-' + lastIndex).show();
      index--;
    } else {
      $('#section-id-' + index).hide();
      index++;
    }
  }

  function getPower() {
    var power;

    if(index < critValue + 1 && index > critValue - 1 ){
      $scope.crit = 1;
    } else if (index > $scope.maxRange / 2) {
      $scope.crit = -1;
    } else {
      $scope.crit = 0;
    }

    if(index < critValue){
      power =  Math.floor(Math.abs(critValue) / Math.abs(index - critValue));
    } else if (index > critValue) {
      power = Math.floor(Math.abs($scope.maxRange - critValue) / Math.abs(index - critValue));
      if(power > 20){
        power = 20;
      }
    } else {
      power = 25;
    }

    return power;
  }

  $scope.stopMeter = function(){
    $scope.spellPower = getPower();
    $interval.cancel(intervalPromise);
    $scope.finalizeSpell($scope.spell);
  };
}
