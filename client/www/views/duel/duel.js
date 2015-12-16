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

  .controller('DuelCtrl', ['$scope', 'socketIO', '$location', '$window',DuelCtrl])
  .name;

function DuelCtrl($scope, socketIO, $location, $window) {
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


  var foe = {id:socket.getFoeId()};
  var self = {id: socket.id};
  [self, foe].map(function(wiz) {
    console.log('createWiz')
    console.log(wiz)
    console.log(wiz.id)
    wiz.getAvatar = function(){
      return document.getElementById(this.id);
    }
    wiz.getHealth = function(){
      return document.getElementById(this.id+'-health');
    }
    wiz.getMana = function(){
      return document.getElementById(this.id+'-mana');
    }
    wiz.addClass = function(cname){
      this.getAvatar().classList.add(cname)
    }
    wiz.removeClass = function(cname) {
      this.getAvatar().classList.remove(cname)
    }
    wiz.setHealth = function(health) {
      this.getHealth().style.width = health +'%';
    }
    wiz.setMana = function(mana) {
      this.getMana().style.width = mana+'%';
    }
    console.log('output')
    console.log(wiz)
    return wiz
  });

  var avatars = {};
  avatars[foe.id] = foe;
  avatars[self.id] = self;

  socket.on(E.ATTACK_PU, function(data) {
    console.log('received attack')
    console.log(data.casterId)
    console.log(avatars)
    avatars[data.casterId].addClass('purple');
    setTimeout(function(){ avatars[data.casterId].removeClass('purple') }, 500)
  });
  socket.on(E.RESOLVE_ATTACK, function(solution) {
    // update world based on solution
    for (wiz in solution.wizStats) {
      // console.log(wiz)
      // console.log(avatars[wiz])
      avatars[wiz].setHealth(solution.wizStats[wiz].health)
      avatars[wiz].setMana(solution.wizStats[wiz].mana)
    }
    console.log('received solution:')
    console.log(solution)
  });
  socket.on('End of battle', function(msg) {
    alert(msg)
    $scope.$apply(function() {
      $location.path('/');
      $window.location.reload();
    });
  })
}
