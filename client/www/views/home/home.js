module.exports = angular.module('wizardApp.home', [
  require('angular-route'),
  require('../duel/duel.js'),
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'HomeCtrl',
        controllerAs: 'home',
        templateUrl: './views/home/home.html'
      });
  }])

  .controller('HomeCtrl', ['$scope', '$location', 'socketIO', HomeCtrl])

  .name;

function HomeCtrl($scope, $location, socketIO) {
  var socket = socketIO.socket;
  var E = socketIO.E
  socket.ready = false;

  $scope.enterBattle = function() {
    socket.emit(socketIO.E.DUEL);
  };

  socket.on(socketIO.E.BEGIN, function(data) {
    $location.path('/duel');
    $scope.$apply();
    socketHelper.initialize(socket, data, E)
    // console.log('The battle has begun!');
  });
}

var socketHelper = {
  initialize: function(socket, BeginData, E) {
    socket.condition = BeginData.condition;
    socket.wizStats = BeginData.wizStats;
    socket.health = BeginData.wizStats[socket.id].health;
    socket.mana = BeginData.wizStats[socket.id].mana;
    this.registerFoeIdFn(socket);
    this.registerAttackFn(socket, E);
  },
  registerFoeIdFn: function(socket) {
    socket.getFoeId = function(){
      for (id in this.wizStats) {
        if (id !== this.id) {
          return id
        }
      }
    }
  },
  registerAttackFn: function(socket, E) {
    socket.attackWith = function(spell) {
      spell.attackId = new Date().getTime();
      socket.emit(E.ATTACK_PU, {attackId: spell.attackId, targetId: socket.getFoeId()});
      return spell
    }
  }

}
