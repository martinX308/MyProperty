const express = require('express');
const router = express.Router();

// link property models
const Property = require('../models/property');
const User = require('../models/user');

router.get('/my-properties', (req, res, next) => {
  const user = req.user; // how does the "global" user declaration work

  Property.find({owner: user._id}, (err, foundProperties) => {
    if (err) {
      res.render('properties/myproperties', { properties: undefined });
    } else {
      res.render('properties/myproperties', { properties: foundProperties });
    }
  });
});

router.get('/create', (req, res, next) => {
  res.render('properties/newproperty');
});

router.post('/create', (req, res, next) => {
  const userId = req.user._id;
  const name = req.body.propertyname;
  const street = req.body.street;
  const nr = req.body.streetnr;
  const zip = req.body.zip;
  const city = req.body.city;
  const country = req.body.country;

  if (name === '' || street === '' || nr === '' || zip === '' || city === '' || country === '') {
    res.render('properties/newproperty', { message: 'Indicate all fields' });
    return;
  }
  const newProperty = new Property({
    name,
    street,
    nr,
    zip,
    city,
    country,
    owner: userId
  });

  newProperty.save((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect('/properties/my-properties');
    }
  });
});

router.get('/:id/edit', (req, res, next) => {
  const propertyId = req.params.id;

  Property.findById(propertyId, (err, property) => {
    if (err) { return next(err); }
    res.render('properties/editproperty', { property: property });
  });
});


router.post('/:id/edit', (req, res, next) => {
  const propertyId = req.params.id;

  const updates = {
    name    : req.body.propertyname,
    street  : req.body.street,
    nr      : req.body.streetnumber,
    zip     : req.body.zip,
    city    : req.body.city,
    country : req.body.country
  };

  Property.findByIdAndUpdate(propertyId, updates, (err, property) => {
    if (err){ return next(err); }
    return res.redirect('/properties/my-properties');
    alert('Your changes have been updated');
  });
});

module.exports = router;
