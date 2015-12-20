var router = require('express').Router();
var path = require('path');
var mongoose = require('mongoose');
var User = require('../models/user.js');
var passport = require('passport');

router.get('/', function(req, res) {
  User.find({}, function(err, results){
    res.send(req.isAuthenticated() ? req.user : 0);
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
});

router.post('/logout', function(req, res) {
  req.logOut();
  res.send(200);
});

module.exports = router;