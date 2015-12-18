var router = require('express').Router();
var mongoose = require('mongoose');
var Spell = require('../models/spell');

router.get('/', function(req, res) {
  Spell.find({}, function(err, results) {
    res.send(results);
  });
});

module.exports = router;
