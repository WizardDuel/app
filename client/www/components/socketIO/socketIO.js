/* globals angular, io */

angular.module('wizardApp.socketIO', [])
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
