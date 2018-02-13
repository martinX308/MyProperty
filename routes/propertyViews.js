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

  const newTransaction = {
    value: req.body.value,
    date: req.body.date,
    name: req.body.accountItem
  };
  const updates = {
    name: req.body.propertyname,
    street: req.body.street,
    nr: req.body.streetnumber,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country
  };

  Property.findByIdAndUpdate(propertyId, { '$push': {'accountingbook': newTransaction}, '$set': updates }, (err, property) => {
    if (err) { return next(err); }
  });
  return res.redirect('/properties/my-properties');
});

router.get('/view/:id', (req, res, next) => {
  const propId = req.params.id;

  Property.findById(propId, 'accountingbook owner', (err, property, next) => {
    if (err) {
      return next(err);
    }
    console.log(property.owner);

    if (req.user.id !== property.owner.toString()) {
      res.redirect('/properties/my-properties');
      return;
    }

    const costTemplate = {
      'rent': 0,
      'tentantFee': 0,
      'gas': 0,
      'electricity': 0,
      'appartmentConstruction': 0,
      'wifi': 0,
      'community': 0,
      'generalMaintenance': 0
    };

    const yearInput = 2017;
    const costArray = [];

    for (let i = 0; i < 12; i++) { // for all months
      let month = Object.assign({}, costTemplate);
      month['month'] = monthNames[i];
      console.log(property.accountingbook.length);
      property.accountingbook.forEach(element => {
        if (element.date.getFullYear() === yearInput && element.date.getMonth() === i) {
          month[element.name] += element.value;
        }
        costArray.push(month);
      });
    }

    // const aggregationMonth = property.accountingbook.map(element =>
    //   element.date.map(x => [x.getMonth(), x.getYear()]));

    // const aggregationType = aggregationMonth.reduce((acc, transaction) => {
    //   let selectedYear = transaction.date[1];
    //   acc[selectedYear][transaction.type][transaction.name] += transaction.value;
    //   return acc;
    // }, {});

    res.render('properties/viewproperty', {transactions: costArray, timeline: monthNames});
  });
});

module.exports = router;
