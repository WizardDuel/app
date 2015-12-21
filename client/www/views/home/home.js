module.exports = angular.module('wizardApp.home', [
  require('angular-route'),
  require('../duel/duel.js'),
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'HomeCtrl',
        controllerAs: 'home',
        templateUrl: './views/home/home.html'
      });
  }])

  .controller('HomeCtrl', ['$scope', '$location', 'socketIO', HomeCtrl])

  .name;

function HomeCtrl($scope, $location, socketIO) {
  var socket = socketIO.socket;
  var E = socketIO.E;
  $scope.name = '';
  $scope.prefix = getPrefix();
  var username = $scope.prefix + $scope.name;

  function getPrefix(){
    var prefixes = ['Mystical', 'Magical', 'Nefarious', 'Wise', 'Happy'];
    return prefixes[Math.floor(Math.random() * prefixes.length)];
  }

  $scope.enterBattle = function() {
    socket.emit(socketIO.E.DUEL, { username: username });
  };

  socket.on(socketIO.E.BEGIN, function(data) {
    $location.path('/duel');
    $scope.$apply();
    socketHelper.initialize(socket, data, E);
  });
}

var socketHelper = {
  initialize: function(socket, BeginData, E) {
    console.log(BeginData)
    socket.condition = BeginData.condition;
    socket.wizStats = BeginData.wizStats;
    socket.health = BeginData.wizStats[socket.id].health;
    socket.mana = BeginData.wizStats[socket.id].mana;
    socket.username = this.getUsername(BeginData.names, socket);
    this.registerFoeIdFn(socket);
    this.registerAttackFn(socket, E);
  },

  getUsername: function(data, socket) {
    for (var id in data){
      if(socket.id !== id){
        return data[id];
      }
    }
  },

  registerFoeIdFn: function(socket) {
    socket.getFoeId = function(){
      for (var id in this.wizStats) {
        if (id !== this.id) {
          return id;
        }
      }
    };
  },
  registerAttackFn: function(socket, E) {
    socket.attackWith = function(spell) {
      spell.attackId = new Date().getTime();
      socket.emit(E.ATTACK_PU, {attackId: spell.attackId, targetId: socket.getFoeId()});
      return spell;
    };
  }

};
