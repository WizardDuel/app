module.exports = angular.module('wizardApp.duel', [
  require('angular-route'),
  require('../components/spells/spells.js'),
  require('../components/wizards/wizards.js'),
  require('../components/spinner/spinner.js')
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/duel', {
        controller: 'DuelCtrl',
        controllerAs: 'duel',
        templateUrl: './views/duel/duel.html'
      });
  }])

  .controller('DuelCtrl', ['$scope', DuelCtrl])
  .name;

function DuelCtrl($scope, socketIO) {
  var socket = socketIO.socket;
  var E = socketIO.E;
  $scope.spells = [
    { name: 'Perry', icon: 'ion-android-favorite-outline' },
    { name: 'Repost', icon: 'ion-ios-plus-outline' },
    { name: 'Attack', icon: 'ion-flame' }
  ];

  $scope.wizards = [

    { user: 'Self', avatar: '../../assets/imgs/evil_wizard.png', id: socket.id },
    { user: 'Opponent', avatar: '../../assets/imgs/DC_wizard.png', id: socket.getFoeId() }
  ];

  socket.on(E.ATTACK_PU, function(data) {
    // $scope.Attack = 'red';
    // setTimeout(function(){$scope.Attack = undefined}, 250)
    socket.attack = data.attackId;
    console.log('Attack!');
    document.getElementsByTagName('body')[0].classList.add('red');
    setTimeout(function(){
      document.getElementsByTagName('body')[0].classList.remove('red');
    },250);
  });
  socket.on(E.RESOLVE_ATTACK, function(data) {
    var solution = data[0];
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
