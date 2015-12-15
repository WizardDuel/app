// require('./index.html');

var angular = require('angular');
var ngRoute = require('angular-route');
var io = require('socket.io-client');
require('./views/home/home.js');
require('./views/duel/duel.js');
// require('./components/socketIO/socket.io.js');

angular.module('wizardApp', ['wizardApp.home']);
