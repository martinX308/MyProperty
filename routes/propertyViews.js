var express = require('express');
var router = express.Router();

router.get('/my-properties', (req, res, next) => {
  res.render('properties/myproperties');
});

router.get('/create', (req, res, next) => {
  res.render('properties/newproperty');
});

router.post('/create', (req, res, next) => {

});

module.exports = router;
