module.exports = angular.module('Authentication', [
    require('angular-route')
  ])
.controller('AuthenticationCtrl', ['$scope', '$location', '$interval', 'ajaxService', AuthenticationCtrl]);

function AuthenticationCtrl($scope, $location, $interval, ajaxService) {

}