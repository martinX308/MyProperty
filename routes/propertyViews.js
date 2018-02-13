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
    value : req.body.value,
    date  : req.body.date,
    name  : req.body.accountItem
  }

  if (newTransaction.date === "" || newTransaction.value === "") {
    Property.findById(propertyId, (err, property) => {
      if (err) { return next(err); }
      res.render('properties/editproperty', { property: property, message : 'All files must be filled before submitting a new record' });
    });
    return;
  }

  const updates = {
    name    : req.body.propertyname,
    street  : req.body.street,
    nr      : req.body.streetnumber,
    zip     : req.body.zip,
    city    : req.body.city,
    country : req.body.country,
  };

  Property.findByIdAndUpdate(propertyId, { "$push": {"accountingbook": newTransaction} , "$set": updates }, (err, property) => {
    if (err){ return next(err); }
  });
  res.redirect('/properties/' + propertyId + '/edit');
  return;
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

    const costTemplate = {
      'rent': 0,
      'tentantFee': 0,
      'gas': 0,
      'electricity': 0,
      'appartment-construction': 0,
      'wifi': 0,
      'community': 0,
      'general-maintenance': 0
    };

    const yearInput = '2017';
    const costArray = [];

    for (let i = 0; i < 12; i++) { // for all months
      let month = costTemplate;
      property.accountingbook.forEach(element => {
        if (element.date.getYear() === yearInput && element.date.getMonth() === i) {
          month[element.name] += element.value * element.type;
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

    res.render('properties/viewproperty', {transactions: aggregationType});
  });
});


module.exports = router;
