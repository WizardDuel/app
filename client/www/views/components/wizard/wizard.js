/* globals angular */

module.exports = angular.module('wizardApp.wizard', [])
  .directive('wizard', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        wizard: '='
      },
      templateUrl: './views/components/wizard/wizard.html',
      controller: 'WizardCtrl'
    };
  })

  .controller('WizardCtrl', ['$scope', WizardCtrl])
  .name;

function WizardCtrl($scope) {

}
