var express = require('express');
var router = express.Router();

router.get('/my-properties', function (req, res, next) {
  res.render('myproperties');
});

module.exports = router;
