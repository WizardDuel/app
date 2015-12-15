/* globals angular */

angular.module('wizardApp.wizard', ['wizardApp.socketIO'])
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

  .controller('WizardCtrl', ['$scope', 'socketIO', WizardCtrl]);

function WizardCtrl($scope, socketIO) {
  var socket = socketIO.socket;
  $scope.health = socket.health;
  $scope.mana = socket.mana;
}
