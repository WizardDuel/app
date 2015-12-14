/* globals angular, io, socket, E */

angular.module('wizardApp.home', [
  'ngRoute',
  'wizardApp.duel'
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'HomeCtrl',
        controllerAs: 'home',
        templateUrl: './views/home/home.html'
      });
  }])

  .factory('socketIO', function() {
    return {
      socket: io(),
      E: {
        DUEL: 'Duel',
        BEGIN: 'Begin'
      }
    };
  })

  .controller('HomeCtrl', ['$scope', '$location', 'socketIO', HomeCtrl]);

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
