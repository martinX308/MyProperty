const express = require('express');
const router = express.Router();

// link property model
const Property = require('../models/property');

// get helper middelware
const ensureloggedin = require('../helpers/ensureUserLoggedIn');
const ensureOwner = require('../helpers/ensurePropertyOwner');

router.get('/my-properties', ensureloggedin, (req, res, next) => {
  const user = req.user; // how does the "global" user declaration work

  Property.find({owner: user._id}, (err, foundProperties) => {
    if (err) {
      res.render('properties/myproperties', { properties: undefined });
    } else {
      res.render('properties/myproperties', { properties: foundProperties });
    }
  });
});

router.get('/create', ensureloggedin, (req, res, next) => {
  res.render('properties/newproperty');
});

router.post('/create', ensureloggedin, (req, res, next) => {
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

router.get('/:id/edit', ensureloggedin, ensureOwner, (req, res, next) => {
  const propertyId = req.params.id;

  Property.findById(propertyId, (err, property) => {
    if (err) { return next(err); }

    res.render('properties/editproperty', { property: property });
  });
});

router.post('/:id/edit/property', (req, res, next) => {
  const propertyId = req.params.id;

  const updates = {
    name: req.body.propertyname,
    street: req.body.street,
    nr: req.body.streetnumber,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country
  };

  Property.findByIdAndUpdate(propertyId, updates, (err, property) => {
    if (err) { return next(err); }
  });
  res.redirect('/properties/' + propertyId + '/edit');
});

router.post('/:id/edit/account', ensureOwner, (req, res, next) => {
  const propertyId = req.params.id;

  const newTransaction = {
    value: req.body.value,
    date: req.body.date,
    name: req.body.accountItem
  };

  if (newTransaction.date === '' || newTransaction.value === '') {
    Property.findById(propertyId, (err, property) => {
      if (err) { return next(err); }
      res.render('properties/editproperty', { property: property, message: 'All files must be filled before submitting a new record' });
    });
    return;
  }

  Property.findByIdAndUpdate(propertyId, { '$push': {'accountingbook': newTransaction}}, (err, property) => {
    if (err) { return next(err); }
  });
  res.redirect('/properties/' + propertyId + '/edit');
});

router.get('/view/:id', ensureloggedin, ensureOwner, (req, res, next) => {
  const propId = req.params.id;

  Property.findById(propId, 'accountingbook owner', (err, property, next) => {
    if (err) {
      return next(err);
    }

    if (req.user.id !== property.owner.toString()) {
      res.redirect('/properties/my-properties');
      return;
    }

    const costTemplate = {
      'rent': 0,
      'tentant-fee': 0,
      'gas': 0,
      'electricity': 0,
      'appartment-construction': 0,
      'wifi': 0,
      'community': 0,
      'general-maintenance': 0
    };

    const yearInput = 2017;
    const costArray = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 12; i++) { // for all months
      let month = Object.assign({}, costTemplate);
      month['month'] = monthNames[i];
      property.accountingbook.forEach(element => {
        if (element.date.getFullYear() === yearInput && element.date.getMonth() === i) {
          month[element.name] += element.value;
        }
        // costArray.push(month);
      });
      costArray.push(month);
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
