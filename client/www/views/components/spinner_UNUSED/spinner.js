/* globals angular */

module.exports = angular.module('wizardApp.spinner', [])
  .directive('spinner', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: './views/components/spinner/spinner.html',
      controller: 'SpinnerCtrl'
    };
  })

  .controller('SpinnerCtrl', ['$scope', SpinnerCtrl])

  .name;

function SpinnerCtrl($scope) {

}
