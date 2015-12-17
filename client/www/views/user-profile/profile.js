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

  .controller('ProfileCtrl', ['$scope', '$location', ProfileCtrl])

  .filter('inSpellBook', function() {
    return function(inBook) {
      return inBook;
    };
  })
  .name;

function ProfileCtrl($scope, $location){
  $scope.wins = 0;    //Database Call Needed
  $scope.losses = 0;  //Database Call Needed
  $scope.book = [];

  //Database Call Needed
  $scope.spells = [
    { inSpellBook: false, name: 'Warp spacetime', icon: 'ion-android-favorite-outline', type: 'Perry', target: 'foe' },
    { inSpellBook: false, name: 'Mystical Judo', icon: 'ion-ios-plus-outline', type: 'Repost', target: 'foe'  },
    { inSpellBook: false, name: 'Magic Missile', icon: 'ion-flame', type: 'Attack', target: 'foe'  }
  ];

  $scope.playNow = function() {
    $location.path('/waiting');

    $scope.book = $scope.spells.filter(function(spell) {
      return spell.inSpellBook;
    });
  };
}