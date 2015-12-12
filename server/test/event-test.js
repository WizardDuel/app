// load and configure chai
var chai = require('chai');
var expect = chai.expect;

// load other dependencies
var E = require('../lib/events')
var sock1 = require('socket.io-client')('http://localhost:3000');
var sock2 = require('socket.io-client')('http://localhost:3000',{forceNew: true});
var sock3 = require('socket.io-client')('http://localhost:3000', {forceNew: true})
var duelers = [sock1, sock2];


describe('Wizard Duel Server Event Responses', function() {
  var duel = false;
  var duel2 = false;
  var sock3Begin = false;

  describe('Begin Duel', function() {

    before(function(done) {
      sock3.on(E.BEGIN, function() {
        sock3Begin = true;
      })
      sock1.emit(E.DUEL);
      sock2.emit(E.DUEL);
      sock2.on(E.BEGIN, function() {duel2 = true});
      sock1.on(E.BEGIN, function() {
        duel = true;
        done();
      })
    })

    it('should start a duel when two sockets emit "duel"', function() {
      expect(duel).to.be.ok;
      expect(duel2).to.be.ok;
    })

    it('should only start the duel for the two duelers', function() {
      expect(sock3Begin).to.not.be.ok;
    });

  });

  describe('Attack/Response Cylcle', function(){

    it('should still be in duel mode', function() {
      expect(duel).to.be.ok;
    })

    //it('should start')

  })

});
