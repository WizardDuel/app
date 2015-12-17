/* globals angular */

module.exports = angular.module('wizardApp.foe', [

  ])
  .directive('foe', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        enemy: '=',
      },
      templateUrl: './views/components/foe/foe.html',
      controller: 'FoeCtrl'
    };
  })

  .controller('FoeCtrl', ['$scope', '$timeout', 'socketIO', FoeCtrl])
  .name;

function FoeCtrl($scope, $timeout, socketIO) {

} // Enemy Controller
