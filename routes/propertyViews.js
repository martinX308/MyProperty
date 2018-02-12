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

router.get('/properties/view/:id', (req, res, next) => {
  const propId = req.params._id;
  Property.findById(propId, 'accountingbook owner', (err, property, next) => {
    if (err) {
      return next(err);
    }
    if (req.user !== property.owner) {
      res.redirect('/properties/my-properties');
      return;
    }

    const aggregationMonth = property.accountingbook.map(element =>
      element.date.map(x => [x.getMonth(), x.getYear()]));

    const aggregationType = aggregationMonth.reduce((acc, transaction) => {
      let selectedYear = transaction.date[1];
      acc[selectedYear][transaction.type][transaction.name] += transaction.value;
      return acc;
    }, {});

    res.render('properties/viewproperty', {transactions: aggregationType});
  });
});
module.exports = router;
