/* globals angular */

angular.module('wizardApp.duel', [
  'ngRoute',
  'wizardApp.wizard',
  'wizardApp.spell',
  'wizardApp.spinner'
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/duel', {
        controller: 'DuelCtrl',
        controllerAs: 'duel',
        templateUrl: './views/duel/duel.html'
      });
  }])

  .controller('DuelCtrl', ['$scope', DuelCtrl]);

function DuelCtrl($scope) {

}
