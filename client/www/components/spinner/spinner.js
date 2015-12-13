/* globals angular */

angular.module('wizardApp.spinner', [])
  .directive('spinner', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: './components/spinner/spinner.html',
      controller: 'SpinnerCtrl'
    };
  })

  .controller('SpinnerCtrl', ['$scope', SpinnerCtrl]);

function SpinnerCtrl($scope) {

}
