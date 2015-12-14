/* globals angular */

angular.module('wizardApp.spells', ['wizardApp.socketIO'])
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

  .controller('SpellsCtrl', ['$scope', '$timeout', 'socketIO', SpellsCtrl]);

function SpellsCtrl($scope, $timeout, socketIO) {
  $scope.castSpell = function(spell) {
    console.log('"' + spell + '"' + ' spell has been cast');

    switch (spell) {
      case 'Recover':

        break;

      case 'Defend':

        break;

      case 'Perry':

        break;

      case 'Repost':

        break;

      case 'Attack':
        var attackId = new Date().getTime();
        socketIO.socket.emit(socketIO.E.ATTACK_PU, {attackId: attackId});
        // var power = Math.floor(Math.random() * 10);
        // var crit = Math.floor(Math.random() * 11 + 1 );
        // $timeout(function() {
        //   console.log('2-SECOND TIMEOUT COMPLETE');
        //   socket.emit(ATTACK, {attackId: attackId, power: power, crit: (crit > 8), time: new Date().getTime()});
        // }, 2000);
        break;
    }
  };
}
