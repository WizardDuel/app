// A $( document ).ready() block.
$( document ).ready(function() {

    // client identifiers
    var name = null;
    var wizId = null;
    var oppId = null

    // Elements
    var $submit = $('#submit');
    var $chatBox = $('#chat-box');
    var $chatBtn = $('#submit');
    var $msgs = $('#messages');
    var $duel = $('#duel');
    var $perry = $('#perry');
    var $attack = $('#attack');
    var $alerter = $('#alerter');

    // Events
    var BEGIN = 'Begin';
    var DUEL = 'Duel';
    var CHAT_MSG = 'chat message';
    var NEW_USR = 'new user';
    var ATTACK_PU = 'Attack Power Up';
    var RESOLVE_ATTACK = 'Resolve Attack';
    var PERRY = 'Perry';
    var RECOVER = 'Recover';
    var DEFEND = 'Defend';
    var WIZ_ID = 'Wizard Id';

    // Initialize Socket Io
    var socket = io();

    // Get Id for self from socket connection
    socket.on(WIZ_ID, function(data) {
      wizId = data;
    })

    // Get nickname;
    if (!name) {
      name = window.prompt('What is your name?', 'Anonymous');
      socket.emit('new user', name);
    }

    // Click Handlers
    $('button').click(function(e) {
      e.preventDefault();
    });

    $submit.click(function(e) {
      e.preventDefault();
      socket.emit(CHAT_MSG, $chatBox.val());
      $chatBox.val('');
      return false;
    });

    $duel.click(function(e) {
      socket.emit(DUEL)
    })

    $attack.click(function(e) {
      socket.emit(ATTACK_PU);
    })

    $perry.click(function(e) {
      var power = Math.floor(Math.random() * 10)
      var crit = Math.floor(Math.random() * 11 + 1 )
      socket.emit(PERRY, {power: power, crit: (crit > 8)})
    });

    // Handle events
    socket.on(BEGIN, function() {
      console.log('fight started');
    });

    socket.on(ATTACK_PU, function() {
      $alerter.addClass('red').animate({
        background: 'white',
      }, 250, function() {
        $alerter.removeClass('red');
      });
    })

    socket.on('chat received', function(data){
      console.log(data);
      $('#messages').append($('<li>').text(data.user +': '+  data.message));
    });



});
