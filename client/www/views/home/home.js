/* globals angular */

angular.module('wizardApp.home', [
  'ngRoute',
  'wizardApp.duel',
  'wizardApp.socketIO'
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'HomeCtrl',
        controllerAs: 'home',
        templateUrl: './views/home/home.html'
      });
  }])

  .controller('HomeCtrl', ['$scope', '$location', 'socketIO', HomeCtrl]);

function HomeCtrl($scope, $location, socketIO) {
  var socket = socketIO.socket;
  $scope.enterBattle = function() {
    socket.emit(socketIO.E.DUEL);
  };

  socket.on(socketIO.E.BEGIN, function(data) {
    $location.path('/duel');
    $scope.$apply();
    socket.wizIds = data;
    socket.health = 100;
    socket.mana = 100;
    socket.getFoeId = function(){
      for (id in this.wizIds) {
        if (this.wizIds[id] !== this.id) {
          return this.wizIds[id]
          console.log('foe:', foe)
        }
      }
      console.log('socket:',this.id)
    }
    console.log('The battle has begun!');
    console.log('Health:', socket.health)
    console.log('Mana:', socket.mana)
  });
}
