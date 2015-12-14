/* globals angular */

angular.module('wizardApp.spell', [])
  .directive('spell', function() {
    return {
      restrict: 'E',
      scope: {
        spell: '='
      },
      templateUrl: './components/spell/spell.html',
      controller: 'SpellCtrl'
    };
  })

  .controller('SpellCtrl', ['$scope', SpellCtrl]);

function SpellCtrl($scope) {

}
