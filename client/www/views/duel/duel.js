var enableWorldUpdates = require('./enableWorldUpdates');
var wizardPhotos = require('../../assets/imgs/wizardPhotos')

module.exports = angular.module('wizardApp.duel', [
  require('angular-route'),
  require('../components/spells/spells.js'),
  require('../components/wizards/wizards.js'),
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/duel', {
        controller: 'DuelCtrl',
        controllerAs: 'duel',
        templateUrl: './views/duel/duel.html'
      });
  }])

  .controller('DuelCtrl', ['$scope', 'socketIO', '$location', '$window', '$timeout', DuelCtrl])
  .name;

function DuelCtrl($scope, socketIO, $location, $window, $timeout) {
  var socket = socketIO.socket;
  var E = socketIO.E;
  socket.attacking = false;
  socket.casting = false;

  wizard2 = Math.floor(Math.random() * wizardPhotos.length);

  $scope.foe = '';
  $scope.wizards = [
    { user: 'Opponent', avatar: '../../assets/imgs/' + wizardPhotos[wizard2], id: socket.getFoeId() }
  ];

  var foe = {
    id: socket.getFoeId(),
    foeId: socket.id
  };
  var self = {
    id: socket.id,
    foeId: foe.id
  };

  [self, foe].map(function(wiz) {
    enableWorldUpdates(wiz)
  })

  var avatars = socket.avatars = {};
  avatars[foe.id] = foe;
  avatars[self.id] = self;

  socket.on(E.ATTACK_PU, function(data) {
    avatars[data.casterId].addClass('purple');
    setTimeout(function(){ avatars[data.casterId].removeClass('purple') }, 500)
  });

  socket.on(E.RESOLVE_ATTACK, function(resolution) {
    // Allow access to spells
    console.log('casting:', socket.castingSpell)
    console.log(self.enableAttackSpells)
    if (!socket.castingSpell) {
      self.enableSpellsBy('type', 'attack');
      self.enableSpellsBy('role', 'enhancer')
      self.disableSpellsBy('role', 'counter')
    }
    // update world based on solution
    for (wiz in resolution.wizStats) {
      // avatars[wiz].setHealth(resolution.wizStats[wiz].health);
      var stats = resolution.wizStats[wiz];
      avatars[wiz].setVital('health', stats.health)
      avatars[wiz].setMana(resolution.wizStats[wiz].mana);
      avatars[wiz].displayAttackResolutionMessage(resolution);
    }
  });

  socket.on(E.UPDATE, function(data) {
    var wizStats = data.wizStats;
    for (wiz in wizStats) {
      avatars[wiz].setHealth(wizStats[wiz].health);
      avatars[wiz].setMana(wizStats[wiz].mana);
    }
  })

  socket.on(E.MANA_REGEN, function(data) {
    for (var wiz in data) {
      avatars[wiz].setMana(data[wiz].mana);
    }
  });

  angular.element(document).ready(function(){
    socket.emit(E.READY);
  });

  socket.on('Start', function(){
    $scope.counter = 3;
    $scope.countdown = function() {
      if($scope.counter === 0){
        $timeout.cancel(stopped);
        $scope.counter = "Duel!";
        $timeout(function() {
          $('.overlay').removeClass('overlay');
          $('.start-timer').hide();
        }, 1200);
      } else {
        stopped = $timeout(function() {
         $scope.counter--;
         $scope.countdown();
        }, 1000);
      }
    };

    $scope.countdown();
  });

  socket.on('End of battle', function(msg) {
    alert(msg)
    $scope.$apply(function() {
      $location.path('/');
      $window.location.reload();
    });
  })
}
