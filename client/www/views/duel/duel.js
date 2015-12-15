module.exports = angular.module('wizardApp.duel', [
  require('angular-route'),
  require('../components/spells/spells.js'),
  require('../components/wizards/wizards.js'),
  require('../components/spinner/spinner.js')
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/duel', {
        controller: 'DuelCtrl',
        controllerAs: 'duel',
        templateUrl: './views/duel/duel.html'
      });
  }])

  .controller('DuelCtrl', ['$scope', DuelCtrl])

  .name;

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
