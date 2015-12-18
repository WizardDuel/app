module.exports = angular.module('wizardApp.profile', [
  require('angular-route'),
  require('../home/home.js'),
  require('../components/spells/spells')
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'ProfileCtrl',
        controllerAs: 'home',
        templateUrl: './views/user-profile/profile.html'
      });
  }])

  .controller('ProfileCtrl', ['$scope', '$location', '$timeout', '$interval', ProfileCtrl])

  .name;

function ProfileCtrl($scope, $location, $timeout, $interval){
  $scope.wins = 5;    //Database Call Needed
  $scope.losses = 5;  //Database Call Needed
  $scope.winPercent = (100 * $scope.wins) / ($scope.wins + $scope.losses);
  $scope.book = [];

  $scope.games = [
    { opponent: 'Bob', result: 'Loss', spellbook: 'Fire Spells', damageDealt: 134, favoriteSpell: 'fireball'},
    { opponent: 'Bob', result: 'Victory', spellbook: 'Fire Spells', damageDealt: 124, favoriteSpell: 'fireball'},
    { opponent: 'Henry', result: 'Victory', spellbook: 'Water Spells', damageDealt: 100, favoriteSpell: 'fireball'},
    { opponent: 'Bob', result: 'Loss', spellbook: 'Earth/Fire Spells', damageDealt: 186, favoriteSpell: 'Lava Torrent'},
    { opponent: 'Maria', result: 'Victory', spellbook: 'Spirt/Wind', damageDealt: 101, favoriteSpell: 'Vortex'},
    { opponent: 'Norm', result: 'Loss', spellbook: 'Fire Spells', damageDealt: 134, favoriteSpell: 'fireball'}
  ];

  //Database Call Needed
  $scope.spells = [
    { inSpellBook: false, name: 'Warp spacetime', icon: 'ion-android-favorite-outline', type: 'Perry', target: 'foe' },
    { inSpellBook: false, name: 'Mystical Judo', icon: 'ion-ios-plus-outline', type: 'Repost', target: 'foe'  },
    { inSpellBook: false, name: 'Magic Missile', icon: 'ion-flame', type: 'Attack', target: 'foe'  }
  ];

  $scope.range = function(n) {
    return new Array(n);
  };

  $scope.playNow = function() {
    $location.path('/waiting');

    $scope.book = $scope.spells.filter(function(spell) {
      return spell.inSpellBook;
    });
  };
}