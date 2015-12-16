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

  $scope.enterBattle = function() {
    socket.emit(socketIO.E.DUEL);
  };

  socket.on(socketIO.E.BEGIN, function(data) {
    $location.path('/duel');
    $scope.$apply();
    console.log(data)
    socket.condition = data.condition
    socket.wizStats = data.wizStats;
    socket.health = data.wizStats[socket.id].health
    socket.mana = data.wizStats[socket.id].mana
    socket.getFoeId = function(){
      for (id in this.wizStats) {
        if (id !== this.id) {
          return id
        }
      }
      console.log('socket:',this.id)
    }
    console.log('The battle has begun!');
    console.log('Health:', socket.health);
    console.log('Mana:', socket.mana);
  });
}
