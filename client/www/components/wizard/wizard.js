/* globals angular */

angular.module('wizardApp.wizard', [])
  .directive('wizard', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        wizard: '='
      },
      templateUrl: './components/wizard/wizard.html',
      controller: 'WizardCtrl'
    };
  })

  .controller('WizardCtrl', ['$scope', WizardCtrl]);

function WizardCtrl($scope) {

}
