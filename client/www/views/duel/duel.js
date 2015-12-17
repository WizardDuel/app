module.exports = angular.module('wizardApp.duel', [
  require('angular-route'),
  require('../components/spells/spells.js'),
  require('../components/wizards/wizards.js'),
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/duel', {
        controller: 'DuelCtrl',
        controllerAs: 'duel',
        templateUrl: './views/duel/duel.html'
      });
  }])

  .controller('DuelCtrl', ['$scope', 'socketIO', '$location', '$window',DuelCtrl])
  .name;

function DuelCtrl($scope, socketIO, $location, $window) {
  var socket = socketIO.socket;
  var E = socketIO.E;
  socket.attacking = false;

  wizard1 = Math.floor(Math.random() * wizardPhotos.length);

  $scope.wizards = [
    { user: 'Opponent', avatar: '../../assets/imgs/' + wizardPhotos[wizard1], id: socket.getFoeId() }
  ];

  var foe = {id:socket.getFoeId()};
  var self = {id: socket.id};
  [self, foe].map(function(wiz) {
    wiz.getAvatar = function(){
      return document.getElementById(this.id);
    }
    wiz.getHealth = function(){
      return document.getElementById(this.id+'-health');
    }
    wiz.getMana = function(){
      return document.getElementById(this.id+'-mana');
    }
    wiz.addClass = function(cname){
      this.getAvatar().classList.add(cname)
    }
    wiz.removeClass = function(cname) {
      this.getAvatar().classList.remove(cname)
    }
    wiz.setHealth = function(health) {
      this.getHealth().style.width = health +'%';
    }
    wiz.setMana = function(mana) {
      this.getMana().style.width = mana+'%';
    }
    wiz.getSpells = function(){
      return document.getElementsByClassName('btn-spell')
    }
    wiz.enableSpells = function(type) {
      var spells = this.getSpells();
      for (var i = 0; i < spells.length; i++ ){
        if (spells[i].getAttribute('data-spell-type') === type) {
          spells[i].removeAttribute('disabled')
        }
      }
    }
    wiz.disableSpells = function(type) {
      var spells = this.getSpells();
      for (var i = 0; i < spells.length; i++ ){
        if (spells[i].getAttribute('data-spell-type') === type) {
          spells[i].setAttribute('disabled', 'disabled')
        }
      }
    }
    wiz.manaCheck = function() {
      var spells = this.getSpells();
    }
  });

  var avatars = socket.avatars = {};
  avatars[foe.id] = foe;
  avatars[self.id] = self;

  socket.on(E.RESOLVE_ATTACK, function(solution) {
    // update world based on solution
    for (wiz in solution.wizStats) {
      avatars[wiz].setHealth(solution.wizStats[wiz].health)
      avatars[wiz].setMana(solution.wizStats[wiz].mana)
    }
    // Spell Access Control
    self.enableSpells('Attack')
    self.disableSpells('Counter')
    var spells = self.getSpells();
  });

  socket.on('End of battle', function(msg) {
    alert(msg)
    $scope.$apply(function() {
      $location.path('/');
      $window.location.reload();
    });
  })
}
var wizardPhotos = [
  'walking_wizard.gif',
  'simpsons_wizard.jpg',
  'wizard_by_adam_brown.jpg',
  'cartman_wizard.png',
  'character_wizard.png',
  'DC_wizard.png',
  'eggplant_wizard_uprising.png',
  'evil_wizard.png',
  'merlin_the_wizard.png',
]
