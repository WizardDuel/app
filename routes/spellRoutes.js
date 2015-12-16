var router = require('express').Router();
var mongoose = require('mongoose');
var Spell = require('../models/spell.js');

router.get('/', function(req, res) {
  Spell.find({}, function(err, results){
    res.send(results);
  });
});

module.exports = router;