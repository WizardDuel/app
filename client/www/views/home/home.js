/* globals angular */

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

  .controller('HomeCtrl', ['$scope', HomeCtrl]);

function HomeCtrl($scope) {

}
