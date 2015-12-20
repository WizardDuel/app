require('./assets/css/style.css');
require('./lib/ionic/css/ionic.css');
require('./assets/scss/style.scss');

var angular = require('angular');
var io = require('socket.io-client');

angular.module('wizardApp', [
  require('./views/user-profile/profile.js'),
])
.factory('socketIO', function() {
    return {
      socket: io.connect('http://localhost:3000'),
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
  .service('ajax', function(){
    this.ajaxGet = function(uri) {
          return $http.get(uri)
            .then(function(result) {
              return result.data;
            });
          };

    this.ajaxPost = function(uri) {
          return $http.post(uri)
            .then(function(result) {
              return result.data;
            });
          };
  });
