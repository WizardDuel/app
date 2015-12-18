/* globals angular */

module.exports = angular.module('wizardApp.wizards', [
  require('../wizard/wizard')
])
  .directive('wizards', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        wizards: '='
      },
      templateUrl: './views/components/wizards/wizards.html',
      controller: 'WizardsCtrl'
    };
  })

  .controller('WizardsCtrl', ['$scope', WizardsCtrl])

  .name;

function WizardsCtrl($scope) {

}
