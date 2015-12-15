/* globals angular */

module.exports = angular.module('wizardApp.spinner', [])
  .directive('spinner', function() {
    return {
      restrict: 'E',
      templateUrl: './components/spinner/spinner.html',
      controller: 'SpinnerCtrl'
    };
  })

  .controller('SpinnerCtrl', ['$scope', SpinnerCtrl]);

function SpinnerCtrl($scope) {

}
