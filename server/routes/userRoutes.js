var router = require('express').Router();
var path = require('path');
var mongoose = require('mongoose');
var User = require('../models/user.js');

router.get('/', function(req, res) {
  User.find({}, function(err, results){
    res.sendFile(path.resolve(__dirname, '../../client/www/landing.html'));
  });
});

router.post('/register', function(req, res) {
  
})

module.exports = router;