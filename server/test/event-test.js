// load and configure chai
var chai = require('chai');
var expect = chai.expect;

// load other dependencies
var E = require('../lib/events')
var helpers = require('./helpers')
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

  describe('Sanity Check', function() {

    it('should persist duel between test suites', function() {
      it('should still be in duel mode', function() {
        expect(duel).to.be.ok;
        expect(duel2).to.be.ok;
      })
    })

  })

  describe('Attack/Response Cycle', function(){

    // All attacks should resolve with an collection of damage objects
    // damage object will have two properties: targetId and damage
    describe('Attack with no perry or repost', function() {
      var attack = null;

      it('should send attack power up to target', function(done) {
        var time = helpers.setTime()
        sock1.emit(E.ATTACK_PU, {targetId: sock2.id, attackId: time});
        sock2.on(E.ATTACK_PU, function(data) {
          expect(data).to.have.property('attackId').and.to.eql(time);
          expect(data.targetId).to.eql(sock2.id);
          attack = data.attackId;
          done();
        });
      });


      it('should resolve the attack on "Attack" event', function(done) {
        var attackSpell = helpers.castSpell(attack);
        sock1.emit(E.ATTACK, attackSpell);
        sock2.on(E.RESOLVE_ATTACK, function(data) {
          expect(data).to.be.an('Array');
          expect(data.length).to.eql(1);
          expect(data[0].targetId).to.eql(sock2.id);
          expect(data[0].damage).to.be.greaterThan(0);
          done()
        })
      });
      after(function(done) {
        sock1.emit('disconnect');
        sock2.emit('disconnect');
        done()
      })
    }); // attack (no counter)

    describe('Attack with Perry (success)', function() {
      var attack = null;

    }); // perry (success)

    // describe('Attack with Perry (fail)'); // perry (fail)
    // describe('Attack with repost (success)'); // repost (success)
    // describe('Attack with repost (fail)'); // repost (fial)

  }); // Attack/Response Cycle

});
