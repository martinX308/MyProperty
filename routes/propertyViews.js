const express = require('express');
const router = express.Router();

// link property models
const Property = require('../models/property');
const User = require('../models/user');

router.get('/my-properties', (req, res, next) => {
  res.render('properties/myproperties');
});

router.get('/create', (req, res, next) => {
  res.render('properties/newproperty');
});

router.post('/create', (req, res, next) => {
  const username = request.session.username;
  const name = req.body.name;
  const street = req.body.street;
  const nr = req.body.nr;
  const zip = req.body.zip;
  const city = req.body.city;
  const country = req.body.country;

  if (name === '' || street === '' || nr === '' || zip === '' || city === '' || country === '') {
    res.render('properties/create', { message: 'Indicate all fields' });
  }

  User.findOne({ username }, 'username', (err, user, next) => {
    if (err) {
      return next(err);
    }
  });
});

module.exports = router;
