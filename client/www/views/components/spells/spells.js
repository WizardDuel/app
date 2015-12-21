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
  $scope.health = 100;
  $scope.mana = 100;

  // gain access to the world
  var avatars = socket.avatars;
  var avatar = socket.avatars[socket.id];
  var foe = socket.avatars[socket.getFoeId()]
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
    console.log('spell', spell)
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
    spell.caster = socket.id;
    switch (spell.type) {
      case 'perry':
        castCounterSpell(avatar, E.PERRY, Magic, socket, spell)
        break;
      case 'repost':
        castCounterSpell(avatar, E.REPOST, Magic, socket, spell)
        break;
      case 'attack':
        var attackSpell = Magic.castSpell(spell, $scope.spellPower, $scope.crit);
        socket.emit(E.ATTACK, attackSpell);
        avatar.flashMessage('-'+spell.cost+' mana');
        break;
    }
    document.getElementById(spell.sound).play();
  };

  function castCounterSpell(avatar, eventType, Magic, socket, spell) {
    spell.attackId = socket.incomingSpell.attackId
    var counterSpell = Magic.castSpell(spell, $scope.spellPower, $scope.crit);
    socket.emit(eventType, counterSpell);
    avatar.resetSpells(socket);
    socket.incomingSpell = null;
    avatar.flashMessage('-'+spell.cost+' mana');
  }

  socket.on(E.ATTACK_PU, function(data) {
    socket.incomingSpell = data;
    avatar.enableSpellsBy('role', 'counter');
    avatar.showSpideySense();
  });

  socket.on(E.RESOLVE_ATTACK, function(resolution) {
    // spell reset
    avatar.hideSpideySense();
    avatar.resetSpells(socket);
    // update world based on solution
    for (var wiz in resolution.wizStats) {
      var stats = resolution.wizStats[wiz];
      console.log(avatars[wiz].getVital('health', true))
      // send message
      console.log('getvital', Number(avatars[wiz].getVital('health', true)))
      console.log('stats', Number(stats.health))
      if (Number(avatars[wiz].getVital('health', true)) === 0) {
        var hDelta = 100 - stats.health
      } else {
        var hDelta = Number(avatars[wiz].getVital('health', true)) - Number(stats.health);
      }
      if (hDelta !== 0) avatars[wiz].flashMessage('-' + hDelta + ' health');
      // set vitals for combatants

      avatars[wiz].setVital('health', stats.health);
      avatars[wiz].setVital('mana', stats.mana);
    }
    avatar.setSelfVitals(avatar.getVital('health', true), avatar.getVital('mana', true))
    foe.setFoeVitals(foe.getVital('health', true), foe.getVital('mana', true))

  });

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

  // spell library
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
}
