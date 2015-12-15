require('./assets/scss/style.scss');
// require('./lib/ionic/css/ionic.css');

var angular = require('angular');
var io = require('socket.io-client');

angular.module('wizardApp', [
  require('./views/home/home.js'),
  require('./views/duel/duel.js'),
])
.factory('socketIO', function() {
    return {
      socket: io.connect('http://localhost:3000'),
      E: {
        DUEL: 'Duel',
        BEGIN: 'Begin',
        ATTACK_PU: 'Attack Power Up',
        RESOLVE_ATTACK: 'Resolve Attack',
        PERRY: 'Perry',
        REPOST: 'Repost',
        RECOVER: 'Recover',
        DEFEND: 'Defend',
        WIZ_ID: 'Wizard Id',
        ATTACK: 'Attack'
      }
    };
  });
