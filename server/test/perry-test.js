// load and configure chai
var chai = require('chai');
var expect = chai.expect;

// load other dependencies
var E = require('../lib/events');
var helpers = require('./helpers');
var sock1 = require('socket.io-client')('http://localhost:3000');
var sock2 = require('socket.io-client')('http://localhost:3000',{forceNew: true});

var duelers = [sock1, sock2];

describe
