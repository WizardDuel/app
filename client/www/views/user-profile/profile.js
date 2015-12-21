module.exports = angular.module('wizardApp.profile', [
  require('angular-route'),
  require('../home/home.js'),
  require('../components/spells/spells')
])
  .config(['$routeProvider', function($routeProvider, $httpProvider, $q, $location) {

  $routeProvider
      .when('/profile', {
        controller: 'ProfileCtrl',
        controllerAs: 'home',
        templateUrl: './views/user-profile/profile.html'
      })
      .when('login', {
        url: '/login',
        templateUrl: '../../templates/login.html'
      });
  }])

  .controller('ProfileCtrl', ['$scope', '$location', '$interval', 'ajaxService', ProfileCtrl])

  .name;

function ProfileCtrl($scope, $location, $interval, ajaxService){
  $scope.wins = 5;    //Database Call Needed to user profile
  $scope.losses = 5;  //Database Call Needed to user profile
  $scope.winPercent = (100 * $scope.wins) / ($scope.wins + $scope.losses);
  $scope.book = { attack: [], enhancer: [], counter: [] };
  spellRolesLengths = { attack: 3, enhancer: 2, counter: 2 };

  $scope.games = [
    { opponent: 'Bob', result: 'Loss', spellbook: 'Fire Spells', damageDealt: 134, favoriteSpell: 'fireball'},
    { opponent: 'Bob', result: 'Victory', spellbook: 'Fire Spells', damageDealt: 124, favoriteSpell: 'fireball'},
    { opponent: 'Henry', result: 'Victory', spellbook: 'Water Spells', damageDealt: 100, favoriteSpell: 'fireball'},
    { opponent: 'Bob', result: 'Loss', spellbook: 'Earth/Fire Spells', damageDealt: 186, favoriteSpell: 'Lava Torrent'},
    { opponent: 'Maria', result: 'Victory', spellbook: 'Spirt/Wind', damageDealt: 101, favoriteSpell: 'Vortex'},
    { opponent: 'Norm', result: 'Loss', spellbook: 'Fire Spells', damageDealt: 134, favoriteSpell: 'fireball'}
  ];

  // Database Call Needed
  ajaxService.get('/spells').then(function(spells) {
    $scope.spells = spells;
    for(var i in spells){
      $scope.spells[i].inSpellBook = false;
    }
  });

  $scope.addToBook = function (spell) {
    var role = spell.role;

    if($scope.book[role].length < spellRolesLengths[role]) {
      $scope.book[role].push(spell);
      spell.inSpellBook = true;
    } else {
      alert('You cannot add any more spells in the ' + role + ' category');
    }
  };


  $scope.playNow = function() {
    $location.path('/waiting');

    $scope.book = $scope.spells.filter(function(spell) {
      return spell.inSpellBook;
    });
  };
}

