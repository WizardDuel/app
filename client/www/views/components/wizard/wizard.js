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

function WizardCtrl($scope, socketIO) {
  var socket = socketIO.socket;
  $scope.health = socket.health;
  $scope.mana = socket.mana;
}
