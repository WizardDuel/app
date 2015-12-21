var router = require('express').Router();
var mongoose = require('mongoose');
var Spell = require('../models/spell.js');

router.get('/', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  Spell.find({}, function(err, results){
    res.send(results);
  });
});

// spells = [{ name: 'Magic Missile', type: 'attack', target: 'foe', role: 'attack', affinity: 'basic', cost: 5},
// { name: 'Water Coffin', type: 'attack', target: 'foe', role: 'attack', affinity: 'water', cost: 7},
// { name: 'Wind Swords', type: 'attack', target: 'foe', role: 'attack', affinity:'air', cost: 7},
// { name: 'Heal', icon: 'ion-heart', type: 'recover-health', target: 'caster', role: 'enhancer', afinity: 'basic', cost: 5, power: 5},
// { name: 'Force Armor', icon: 'ion-ios-plus-outline', type: 'buff-health', target: 'caster', role:'enhancer', afinity:'basic', cost: 5, duration:20},
// { name: 'Warp spacetime', icon: 'ion-android-favorite-outline', type: 'perry', target: 'foe', role: 'counter', afinity: 'basic', cost: 5 },
// { name: 'Mystical Judo', icon: 'ion-ios-plus-outline', type: 'repost', target: 'foe', role: 'counter', afinity: 'basic', cost: 6 },
// ];

// for(var i = 0; i < spells.length; i++){
//   var spell = new Spell(spells[i]);

//   spell.save(function(err, docs) {
//     if(err) throw err;
//     console.log(docs);
//   });
// }

module.exports = router;