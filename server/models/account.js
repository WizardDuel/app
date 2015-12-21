var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new mongoose.Schema({
  username: String,
  password: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);