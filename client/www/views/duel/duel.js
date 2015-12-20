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
  //initialize refs to dom els and socket references
  var socket = socketIO.socket;
  var E = socketIO.E;
  socket.attacking = false;

  var foe = { id: socket.getFoeId(), foeId: socket.id };
  var self = { id: socket.id, foeId: foe.id };
  [self, foe].map(function(wiz) { enableWorldUpdates(wiz); });
  var avatars = {};
  avatars[foe.id] = foe;
  avatars[self.id] = self;
  socket.avatars = avatars;

   // Socket events
   angular.element(document).ready(function(){
     socket.emit(E.READY);
   });

   socket.on('Start', function(){
     $scope.counter = 3;
     $scope.countdown();
   });

   socket.on(E.UPDATE, function(data) {
     var wizStats = data.wizStats;
     for (wiz in wizStats) {
       avatars[wiz].setVital('health', wizStats[wiz].health);
       avatars[wiz].setVital('mana', wizStats[wiz].mana);
     }
   });

   socket.on(E.MANA_REGEN, function(data) {
     console.log(data)
     for (var wiz in data) {
       avatars[wiz].setVital('mana', data[wiz].mana);
     }
   });

  // socket.on(E.ATTACK_PU, function(data) {
  //   socket.incomingSpell = data;
  //   avatars[data.casterId].addClass('purple');
  //   setTimeout(function(){ avatars[data.casterId].removeClass('purple'); }, 500);
  // });

  socket.on(E.RESOLVE_ATTACK, function(resolution) {
    // spell reset
    self.hideSpideySense()
    self.resetSpells(socket);
    // update world based on solution
    for (var wiz in resolution.wizStats) {
      var stats = resolution.wizStats[wiz];
      // send message
      var hDelta = avatars[wiz].getVital('health', true) - stats.health;
      if (hDelta !== 0) avatars[wiz].flashMessage('-' + hDelta + ' health');
      // set vitals for combatants

      avatars[wiz].setVital('health', stats.health)
      avatars[wiz].setVital('mana', stats.mana);
    }
  });

  socket.on('End of battle', function(msg) {
    alert(msg);
    $scope.$apply(function() {
      $location.path('/');
      $window.location.reload();
    });
  });

  $scope.wizards = [
    {user: 'Opponent',
    avatar: '../../assets/imgs/' + wizardPhotos[Math.floor(Math.random() * wizardPhotos.length)],
    id: socket.getFoeId()
  }];

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
}
