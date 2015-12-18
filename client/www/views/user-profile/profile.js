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
  $scope.wins = 0;    //Database Call Needed
  $scope.losses = 0;  //Database Call Needed
  $scope.book = [];

  $scope.range = function(n) {
    return new Array(n);
  };

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

  $scope.speed = 1; //ms
  $scope.maxRange = 100;
  $scope.meterStarted = false;
  $scope.counter = $scope.maxRange / 2;

  var index = 0;
  var last;
  var decrement = false;
  var intervalPromise;


  function changeIndexClass() {
    $('#section' + index).addClass('active-meter');
    $('#section' + last).removeClass('active-meter');
    last = index;

    if(index === $scope.maxRange) decrement = true;
    if(index === 0) decrement = false;

    if(decrement) index--;
    else index++;
  }

  function stopMeter(){
    $interval.cancel(intervalPromise);
    $scope.power = index;
    $scope.meterStarted = false;
    $('.section').removeClass('active-meter');
    console.log($scope.power);
  }

  $scope.meterClick = function(){
    console.log('clicked');

    if(!$scope.meterStarted) {
      $scope.meterStarted = true;
      intervalPromise = $interval(changeIndexClass, $scope.speed);
    } else {
      stopMeter();
    }
  };

  $scope.$on('$destroy', function() {
    stopMeter();
  });
}