// load and configure chai
var chai = require('chai');
var expect = chai.expect;
var uuid = require('node-uuid');

// load other dependencies
var E = require('../lib/events');
var helpers = require('./helpers');

describe('Attack/Response Cycle', function() {
  // All attacks should resolve with an collection of damage objects
  // damage object will have two properties: targetId and damage

  // initialize socks and create reference objects
  var sock = 0;
  var socks = [];
  var attacks = [];
  var spells = [];

  // setup test specific getters
  function attackId(sck) {return attacks[0];}
  function attacking(sck) {return socks[sck][0];}
  function defending(sck) {return socks[sck][1];}
  function castAttack(sck) {return spells[sck][0];}
  function castDefense(sck) {return spells[sck][1];}

  beforeEach(function(done) {
    // have to initialize new clients or you get errors reregistering listeners
    var attacker = require('socket.io-client')('http://localhost:3000', {forceNew: true});
    var defender = require('socket.io-client')('http://localhost:3000', {forceNew: true});
    attacks.push(helpers.setTime());
    attacker.emit(E.DUEL);
    defender.emit(E.DUEL);
    defender.on(E.BEGIN, function() {
      socks.push([attacker, defender]);
      done();
    });
  });

  describe('- No Response', function() {

    it('should do full damage when no response from defender', function(done) {
      // initialize attack
      attacking(sock).emit(E.ATTACK_PU, {targetId: defending(sock).id, attackId: attackId(sock)});
      defending(sock).on(E.ATTACK_PU, function(data) {

        // create spells
        var attackSpell = helpers.castSpell(attackId(sock), 8, null, 0);
        attackSpell.msg = 'no response';
        spells.push([attackSpell]);

        // cast spells
        attacking(sock).emit(E.ATTACK, castAttack(sock));

        // resolve cycle
        defending(sock).on(E.RESOLVE_ATTACK, function(data) {
          expect(data).to.be.an('Array');
          expect(data.length).to.eql(1);
          expect(data[0].damage).to.be.eql(8);
          done();
        });
      });

    });
  }); // no response

  describe('- Perry', function() {

    it('should subtract perry from attack on perry success', function(done) {
      // initialize attack
      attacking(sock).emit(E.ATTACK_PU, {targetId: defending(sock).id, attackId: attackId(sock)});
      defending(sock).on(E.ATTACK_PU, function(data) {

        // create spells
        var defensiveSpell = helpers.castSpell(attackId(sock), 6, 0, -10);
        var attackSpell = helpers.castSpell(attackId(sock), 10, 0, 10);
        attackSpell.msg = 'perry (s)';
        spells.push([attackSpell, defensiveSpell]);

        // cast spells
        defending(sock).emit(E.PERRY, castDefense(sock));
        attacking(sock).emit(E.ATTACK, castAttack(sock));

        // resolve cycle
        defending(sock).on(E.RESOLVE_ATTACK, function(data) {
          expect(data).to.be.an('Array');
          expect(data.length).to.eql(1);
          expect(data[0].damage).to.be.eql(4);
          done();
        });
      });

    }); // good perry

    it('should have a full attack on late perry', function(done) {
      // initialize attack
      attacking(sock).emit(E.ATTACK_PU, {targetId: defending(sock).id, attackId: attackId(sock)});
      defending(sock).on(E.ATTACK_PU, function(data) {

        // create spells
        var attackSpell = helpers.castSpell(attackId(sock), 10, null, -10);
        var defensiveSpell = helpers.castSpell(attackId(sock), 6, null, 10);
        attackSpell.msg = 'perry (l)';
        spells.push([attackSpell, defensiveSpell]);

        // cast spells
        defending(sock).emit(E.PERRY, castDefense(sock));
        attacking(sock).emit(E.ATTACK, castAttack(sock));

        // resolve cycle
        defending(sock).on(E.RESOLVE_ATTACK, function(data) {
          expect(data).to.be.an('Array');
          expect(data.length).to.eql(1);
          expect(data[0].damage).to.be.eql(10);
          done();
        });
      });

    }); // late perry

    it('should block everything on crit', function(done) {
      // initialize attack
      attacking(sock).emit(E.ATTACK_PU, {targetId: defending(sock).id, attackId: attackId(sock)});
      defending(sock).on(E.ATTACK_PU, function(data) {

        // create spells
        // crit still has to come before attack
        var defensiveSpell = helpers.castSpell(attackId(sock), 6, 1, -10);
        var attackSpell = helpers.castSpell(attackId(sock), 10, null, 10);
        attackSpell.msg = 'perry (c)';
        spells.push([attackSpell, defensiveSpell]);

        // cast spells
        defending(sock).emit(E.PERRY, castDefense(sock));
        attacking(sock).emit(E.ATTACK, castAttack(sock));

        // resolve cycle
        defending(sock).on(E.RESOLVE_ATTACK, function(data) {
          expect(data).to.be.an('Array');
          expect(data.length).to.eql(1);
          expect(data[0].damage).to.be.eql(0);
          done();
        });
      });

    }); // crit
  }); // perry

  // describe('- Repost'); // Repost
  // describe('- Crit'); // Crit
  afterEach(function() {
    sock++;
  });
}); // Attack/Response Cycle
