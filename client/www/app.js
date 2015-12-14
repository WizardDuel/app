/* globals angular */

// angular.module('wizardApp', ['ngRoute'])
//   .config(['$routeProvider', function($routeProvider) {
//     $routeProvider
//       .when('/', {
//         controller: 'HomeCtrl',
//         controllerAs: 'home',
//         templateUrl: './views/home/home.html'
//       })
//       .when('/duel', {
//         controller: 'DuelCtrl',
//         controllerAs: 'duel',
//         templateUrl: './views/duel/duel.html'
//       });
//   }])
//
//   .controller('HomeCtrl', ['$scope', function($scope) {
//
//   }])
//
//   .controller('DuelCtrl', ['$scope', function($scope) {
//
//   }]);

angular.module('wizardApp', ['wizardApp.home']);
  // .config(['$routeProvider', function($routeProvider) {
  //   $routeProvider
  //     .when('/', {
  //       redirectTo: function() { return '/'; }
  //     });
  // }]);

  // .factory('socketIO', function() {
  //   var socket = io();
  // });

// var socket = io();

// var E = {
//   DUEL: 'Duel',
//   BEGIN: 'Begin'
// };
