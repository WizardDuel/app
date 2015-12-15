module.exports = angular.module('wizardApp.home', [
  require('angular-route'),
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
  $scope.enterBattle = function() {
    socketIO.socket.emit(socketIO.E.DUEL);
  };

  socketIO.socket.on(socketIO.E.BEGIN, function() {
    $location.path('/duel');
    $scope.$apply();
    console.log('The battle has begun!');
  });
}
