require('./assets/css/style.css');
require('./lib/ionic/css/ionic.css');
require('./assets/scss/style.scss');

var angular = require('angular');
var io = require('socket.io-client');
var rootUrl = 'http://localhost:3000';

angular.module('wizardApp', [
  require('./views/user-profile/profile.js'),
])
.factory('socketIO', function() {
    return {
      socket: io.connect(rootUrl),
      E: {
        DUEL: 'Duel',
        BEGIN: 'Begin',                     //Loads Duel View
        READY: 'Ready',                     // Waits for users to load
        START: 'Start',                     //Begins Duel
        ATTACK_PU: 'Attack Power Up',
        RESOLVE_ATTACK: 'Resolve Attack',
        PERRY: 'Perry',
        REPOST: 'Repost',
        RECOVER: 'Recover',
        DEFEND: 'Defend',
        WIZ_ID: 'Wizard Id',
        ATTACK: 'Attack',
        MANA_REGEN: 'Mana Regen',
        ENHANCE: 'Enhance',
        UPDATE: 'Update'
      }
    };
})
.service('ajaxService', function($http){
  this.get = function(uri) {
        return $http.get(rootUrl + uri)
          .then(function(result) {
            return result.data;
          });
        };

  this.post = function(uri) {
        return $http.post(rootUrl + uri)
          .then(function(result) {
            return result.data;
          });
        };
});
