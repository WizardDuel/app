module.exports = angular.module('wizardApp.duel', [
  require('angular-route'),
  require('../components/spells/spells'),
  require('../components/wizards/wizards'),
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/duel', {
        controller: 'DuelCtrl',
        controllerAs: 'duel',
        templateUrl: './views/duel/duel.html'
      });
  }])

  .controller('DuelCtrl', ['$scope', 'socketIO', '$location', '$window', '$timeout', DuelCtrl])

  .name;

function DuelCtrl($scope, socketIO, $location, $window, $timeout) {
  var socket = socketIO.socket;
  var E = socketIO.E;
  socket.attacking = false;

  $scope.spells = [
    {name: 'Warp spacetime', icon: 'ion-android-favorite-outline', type: 'Perry', target: 'foe'},
    {name: 'Mystical Judo', icon: 'ion-ios-plus-outline', type: 'Repost', target: 'foe'},
    {name: 'Magic Missile', icon: 'ion-flame', type: 'Attack', target: 'foe'}
  ];

  wizard2 = Math.floor(Math.random() * wizardPhotos.length);

  $scope.foe = '';
  $scope.wizards = [
    {user: 'Opponent', avatar: '../../assets/imgs/' + wizardPhotos[wizard2], id: socket.getFoeId()}
  ];

  var foe = {
    id: socket.getFoeId(),
    foeId: socket.id
  };
  var self = {
    id: socket.id,
    foeId: foe.id
  };

  [self, foe].map(function(wiz) {
    wiz.getAvatar = function() {
      return document.getElementById(this.id);
    };

    wiz.getHealth = function() {
      return document.getElementById(this.id + '-health');
    };

    wiz.getMana = function() {
      return document.getElementById(this.id + '-mana');
    };

    wiz.addClass = function(cname) {
      this.getAvatar().classList.add(cname);
    };

    wiz.removeClass = function(cname) {
      this.getAvatar().classList.remove(cname);
    };

    wiz.setHealth = function(health) {
      this.getHealth().style.width = health + '%';
    };

    wiz.setMana = function(mana) {
      this.getMana().style.width = mana + '%';
    };

    wiz.enableCounterSpells = function() {
      var buttons = document.getElementsByClassName('btn-spell');
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute('data-spell-type') !== 'Attack') {
          buttons[i].removeAttribute('disabled');
        }
      }
    };

    wiz.disableCounterSpells = function() {
      var buttons = document.getElementsByClassName('btn-spell');
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute('data-spell-type') !== 'Attack') {
          buttons[i].setAttribute('disabled', 'disabled');
        }
      }
    };

    wiz.enableAttackSpells = function() {
      var buttons = document.getElementsByClassName('btn-spell');
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute('data-spell-type') === 'Attack') {
          buttons[i].removeAttribute('disabled');
        }
      }
    };

    wiz.disableAttackSpells = function() {
      var buttons = document.getElementsByClassName('btn-spell');
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute('data-spell-type') === 'Attack') {
          buttons[i].setAttribute('disabled', 'disabled');
        }
      }
    };

    return wiz;
  });

  var avatars = socket.avatars = {};
  avatars[foe.id] = foe;
  avatars[self.id] = self;

  socket.on(E.ATTACK_PU, function(data) {
    avatars[data.casterId].addClass('purple');
    setTimeout(function() { avatars[data.casterId].removeClass('purple'); }, 500);
  });

  socket.on(E.RESOLVE_ATTACK, function(resolution) {
    // update world based on solution
    for (var wiz in resolution.wizStats) {
      avatars[wiz].setHealth(resolution.wizStats[wiz].health);
      avatars[wiz].setMana(resolution.wizStats[wiz].mana);
    }

    var message;
    function updateView(wizId, message) {
      document.getElementById(wizId + '-wizard-message').innerHTML = message;
      if (wizId === foe.id) { document.getElementById(wizId + '-avatar-overlay').style.visibility = 'visible'; }
      setTimeout(function() {
        if (wizId === foe.id) { document.getElementById(wizId + '-avatar-overlay').style.visibility = 'hidden'; }
        document.getElementById(wizId + '-wizard-message').innerHTML = '';
      }, 1500);
    }
    switch (self.id) {
      case resolution.casterId:
        message = 'LANDED ' + resolution.spellName + ' (Damage: ' + resolution.damage + ')';
        updateView(foe.id, message);
        break;

      case resolution.targetId:
        message = 'HIT BY ' + resolution.spellName + ' (Damage: ' + resolution.damage + ')';
        updateView(self.id, message);
        break;
    }

    // Allow access to spells
    self.enableAttackSpells();
    self.disableCounterSpells();
  });

  socket.on(E.MANA_REGEN, function(data) {
    console.log(data);
    for (var wiz in data) {
      avatars[wiz].setMana(data[wiz].mana);
    }
  });

  angular.element(document).ready(function() {
    socket.emit(E.READY);
  });

  socket.on('Start', function() {
    $scope.counter = 3;
    console.log('started');

    $scope.countdown = function() {
      if ($scope.counter === 0) {
        $timeout.cancel(stopped);
        $scope.counter = 'Duel!';
        $timeout(function() {
          $('.overlay').removeClass('overlay');
          $('.start-timer').hide();
        }, 1200);
      } else {
        stopped = $timeout(function() {
         $scope.counter--;
         $scope.countdown();
        }, 1000);
      }
    };

    $scope.countdown();
  });

  socket.on('End of battle', function(msg) {
    alert(msg);
    $scope.$apply(function() {
      $location.path('/');
      $window.location.reload();
    });
  });
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
];
