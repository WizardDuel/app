/* globals angular */

angular.module('wizardApp.spells', ['wizardApp.spell'])
  .directive('spells', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        spells: '='
      },
      templateUrl: './components/spells/spells.html',
      controller: 'SpellsCtrl'
    };
  })

  .controller('SpellsCtrl', ['$scope', SpellsCtrl]);

function SpellsCtrl($scope) {
  $scope.attackSpell = function () {
    console.log('HELLO');
  };
}
