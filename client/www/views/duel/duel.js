module.exports = angular.module('wizardApp.duel', [
  require('angular-route'),
  require('../components/spells/spells.js'),
  require('../components/wizards/wizards.js'),
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/duel', {
        controller: 'DuelCtrl',
        controllerAs: 'duel',
        templateUrl: './views/duel/duel.html'
      });
  }])

  .controller('DuelCtrl', ['$scope', 'socketIO', DuelCtrl])
  .name;

function DuelCtrl($scope, socketIO) {
  var socket = socketIO.socket;
  var E = socketIO.E;

  $scope.spells = [
    { name: 'Warp spacetime', icon: 'ion-android-favorite-outline', type: 'Perry' },
    { name: 'Mystical Judo', icon: 'ion-ios-plus-outline', type: 'Repost' },
    { name: 'Magic Missile', icon: 'ion-flame', type: 'Attack' }
  ];

  $scope.wizards = [
    { user: 'Self', avatar: '../../assets/imgs/evil_wizard.png', id: socket.id },
    { user: 'Opponent', avatar: '../../assets/imgs/DC_wizard.png', id: socket.getFoeId() }
  ];

  socket.on(E.ATTACK_PU, function(data) {
    socket.attack = data.attackId;
    console.log('Attack!');
    document.getElementsByTagName('body')[0].classList.add('red');
    setTimeout(function(){
      document.getElementsByTagName('body')[0].classList.remove('red');
    },250);
  });
  socket.on(E.RESOLVE_ATTACK, function(solution) {
    // update world based on solution

    console.log('resolution:', solution);
    switch(solution.targetId) {
      case socket.id:
        socket.health = Number(socket.health) - Number(solution.damage);
        document.getElementById(socket.id +'-health').style.width = socket.health + '%';
        break;
      case socket.getFoeId():
        var origHealth = document.getElementById(solution.targetId + '-health').style.width;
        document.getElementById(solution.targetId +'-health').style.width = Number(origHealth.split('%')[0]) - Number(solution.damage) + '%';
        break;
    }
    if (solution.counterCasterId && (solution.counterCasterId !== socket.id)) {
      var origMana = document.getElementById(solution.targetId + '-mana').style.width;
      document.getElementById(solution.counterCasterId +'-mana').style.width = Number(origMana.split('%')[0]) - 5 + '%';
    }
    if (solution.casterId !== socket.id) {
      var origMana = document.getElementById(solution.casterId + '-mana').style.width;
      document.getElementById(solution.casterId +'-mana').style.width = Number(origMana.split('%')[0]) - 5 + '%';
    }

    console.log('Health:', socket.health);
    console.log('Mana:', socket.mana);
  });

  }
