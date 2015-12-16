var mongoose = require('mongoose');

var Spell = new mongoose.Schema({
  type: String,
  attack: Number,
  defense: Number,
  name: String
});

module.exports = mongoose.model('Spell', Spell);