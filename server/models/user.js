var mongoose = require('mongoose');

var User = new mongoose.Schema({
  screenname: String,
  spells: [],
  recentGames: [],
  wins: Number,
  Losses: Number,
});

module.exports = mongoose.model('User', User);