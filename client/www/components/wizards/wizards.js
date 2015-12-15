/* globals angular */

angular.module('wizardApp.wizards', ['wizardApp.wizard'])
  .directive('wizards', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        wizards: '='
      },
      templateUrl: './components/wizards/wizards.html',
      controller: 'WizardsCtrl'
    };
  })

  .controller('WizardsCtrl', ['$scope', WizardsCtrl]);

function WizardsCtrl($scope) {

}
