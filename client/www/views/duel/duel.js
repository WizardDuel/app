/* globals angular */

angular.module('wizardApp.duel', [
  'ngRoute',
  // 'wizardApp.spell',
  'wizardApp.spells',
  // 'wizardApp.wizard',
  'wizardApp.wizards',
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
  $scope.spells = [
    { name: 'Recover' },
    { name: 'Defend' },
    { name: 'Perry' },
    { name: 'Repost' },
    { name: 'Attack' }
  ];

  $scope.wizards = [
    { user: 'Self', avatar: '../../img/evil_wizard.png' },
    { user: 'Opponent', avatar: '../../img/DC_wizard.png' }
  ];
}
