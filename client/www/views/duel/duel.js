var enableWorldUpdates = require('./enableWorldUpdates');
var wizardPhotos = require('../../assets/imgs/wizardPhotos');

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

  var foe = { id: socket.getFoeId(), foeId: socket.id, health:100, mana:100 };
  var self = { id: socket.id, foeId: foe.id, health:100, mana:100 };
  [self, foe].map(function(wiz) { enableWorldUpdates(wiz); });
  foe.setFoeVitals = function(health, mana){
    document.getElementById('foe-health').innerHTML = this.getVital('health', true);
    document.getElementById('foe-mana').innerHTML = this.getVital('mana', true);
  }
  self.setSelfVitals = function(health, mana){
    document.getElementById('self-health').innerHTML = this.getVital('health', true);
    document.getElementById('self-mana').innerHTML = this.getVital('mana', true);
  }
  var avatars = {};
  avatars[foe.id] = foe;
  avatars[self.id] = self;
  avatars.foe = foe
  avatars.self = self
  socket.avatars = avatars;

   // Socket events
   angular.element(document).ready(function(){
     socket.emit(E.READY);
   });

   socket.on('Start', function(){
     $scope.counter = 4;
     $scope.countdown();
   });

   socket.on(E.UPDATE, function(data) {
     var wizStats = data.wizStats;
     for (var wiz in wizStats) {
       if (wiz === socket.id) {
         var hDelta = wizStats[wiz].health - avatars[wiz].getVital('health', true)
         avatars[wiz].flashMessage('+' + hDelta + ' health')
       }
       avatars[wiz].setVital('health', wizStats[wiz].health);
       avatars[wiz].setVital('mana', wizStats[wiz].mana);
     }
     self.setSelfVitals(self.getVital('health', true), self.getVital('mana', true))

   });

   socket.on(E.MANA_REGEN, function(data) {
     for (var wiz in data) {
       avatars[wiz].setVital('mana', data[wiz].mana);
     }
   });

  socket.on('End of battle', function() {

    $scope.$apply(function() {
      $location.path('/');
      $window.location.reload();
    });
  })

  socket.on('disconnect', function(msg) {
    alert(msg)
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
      $scope.counter = "Go!";
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
