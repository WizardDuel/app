var mongoose = require('mongoose');

var Spell = new mongoose.Schema({
  name: String,
  type: String,
  role: String,
  affinity: String,
  target: String,
  cost: Number
});

module.exports = mongoose.model('Spell', Spell);