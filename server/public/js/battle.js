// This filed is not currently relevant

// A $( document ).ready() block.
$(document).ready(function() {

  // client identifiers
  var name = null;
  var wizId = null;
  var oppId = null;
  var threat = {};

  // Elements
  var $submit = $('#submit');
  var $chatBox = $('#chat-box');
  var $chatBtn = $('#submit');
  var $msgs = $('#messages');
  var $duel = $('#duel');
  var $perry = $('#perry');
  var $attack = $('#attack');
  var $alerter = $('.alerter');
  var $battleField = $('#battle-field');
  var $stagingArea = $('#staging-area');

  // Events
  var ATTACK = 'Attack';
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
  // var socket = io();

  // Get Id for self from socket connection
  socket.on(WIZ_ID, function(data) {
    wizId = data;
  });

  // Click Handlers
  $('button').click(function(e) {
    e.preventDefault();
  });

  $duel.click(function(e) {
    socket.emit(DUEL);
  });

  $attack.click(function(e) {
    var attackId = new Date().getTime();
    socket.emit(ATTACK_PU, {attackId: attackId});
    var power = Math.floor(Math.random() * 10);
    var crit = Math.floor(Math.random() * 11 + 1);
    window.setTimeout(function() {
      socket.emit(ATTACK, {attackId: attackId, power: power, crit: (crit > 8), time: new Date().getTime()});
    }, 2000);
  });

  $perry.click(function(e) {
    var power = Math.floor(Math.random() * 10);
    var crit = Math.floor(Math.random() * 11 + 1);
    socket.emit(PERRY, {attackId: threat.id, power: power, crit: (crit > 8), time: new Date().getTime()});
  });

  // Handle events
  socket.on(BEGIN, function() {
    console.log('fight started');
    $stagingArea.addClass('hidden');
    $battleField.removeClass('hidden');
  });

  socket.on(ATTACK_PU, function(data) {
    threat.id = data.attackId;
    $alerter.addClass('red').animate({
      background: 'white',
    }, 250, function() {
      $alerter.removeClass('red');
    });
  });

  socket.on(RESOLVE_ATTACK, function(resolution) {
    console.log(resolution);
  });
});
