const express = require('express');
const router = express.Router();

// link property model
const Property = require('../models/property');

// get helper middelware
const ensureloggedin = require('../helpers/ensureUserLoggedIn');
const ensureOwner = require('../helpers/ensurePropertyOwner');
const createUser = require('../helpers/createUser');

// --- show all properties for logged in user
router.get('/my-properties', ensureloggedin, (req, res, next) => {
  const user = req.user; // how does the "global" user declaration work?

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

// --- create new property for logged in user
router.post('/create', ensureloggedin, (req, res, next) => {
  const userId = req.user._id;
  const name = req.body.propertyname;
  const street = req.body.street;
  const nr = req.body.streetnr;
  const zip = req.body.zip;
  const city = req.body.city;
  const country = req.body.country;

  let location = {
    type: 'Point',
    coordinates: [req.body.latitude, req.body.longitude]
  };

  if (name === '' || street === '' || nr === '' || zip === '' || city === '' || country === '' || location.coordinates[0] === '' || location.coordinates[1] === '' ) {
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
    owner: userId,
    location: location
  });

  newProperty.save((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect('/properties/my-properties');
    }
  });
});

// --- show edit form for single property
router.get('/:id/edit', ensureloggedin, ensureOwner, (req, res, next) => {
  const propertyId = req.params.id;
  const propertyPopulated = Property.findById(propertyId).populate('tenants');

  // propertyPopulated.exec((err, property) => {
  //   if (err) { return next(err); }
  //   res.render('properties/editproperty', { property: property, tenants: property.tenants });
  // });

  Property.findById(propertyId, (err, property) => {
    if (err) { return next(err); }

    Property.findById(propertyId)
      .populate('tenants')
      .exec((err, prop) => {
        if (err) { return next(err); }
        console.log(prop.tenants);
        res.render('properties/editproperty', { property: prop });
      });
  });
});

// --- update single property master data
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

// ---update single property accountingbook with new tenant
router.post('/:id/edit/createtenant', ensureOwner, (req, res, next) => {
  const propertyId = req.params.id;
  const newTenant = {
    username: req.body.tenantUsername,
    password: req.body.tenantpw,
    email: req.body.tenantmail,
    role: 'Tenant'
  };

  if (newTenant.username === '' || newTenant.password === '' || newTenant.email === '') {
    Property.findById(propertyId, (err, property) => {
      if (err) {
        return next(err);
      }
      res.render('properties/editproperty', { property: property, message: 'All fields must be filled before submitting a new record' });
    });
    return;
  }

  createUser(newTenant, (resultMessage) => {
    Property.findByIdAndUpdate(propertyId, { '$push': { 'tenants': resultMessage.user } }, (err, property) => {
      if (err) { return next(err); }
      res.redirect('/properties/' + propertyId + '/edit');
    });
  });
});

// ---update single property accountingbook with new transaction
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
      res.render('properties/editproperty', { property: property, message: 'All fields must be filled before submitting a new record' });
    });
    return;
  }

  Property.findByIdAndUpdate(propertyId, { '$push': {'accountingbook': newTransaction}}, (err, property) => {
    if (err) { return next(err); }
  });
  res.redirect('/properties/' + propertyId + '/edit');
});

// --- update single property accountingbook delete transaction
router.post('/:idProperty/:idAccounting/delete', (req, res, next) => {
  const propertyId = req.params.idProperty;
  const accountingRowId = req.params.idAccounting;

  Property.findById(propertyId, (err, property) => {
    if (err) { return next(err); }
    property.accountingbook.pull({'_id': accountingRowId});

    property.save(function (err) {
      if (err) {
        return next(err);
      }
    });
  });

  res.redirect('/properties/' + propertyId + '/edit');
});

// --- view single property by id
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

    const yearInput = 2017;// Fixed year > adjust to input
    const costArray = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 12; i++) { // for all months
      let month = Object.assign({}, costTemplate);
      month['month'] = monthNames[i];
      property.accountingbook.forEach(element => {
        if (element.date.getFullYear() === yearInput && element.date.getMonth() === i) {
          month[element.name] += element.value;
        }
      });
      costArray.push(month);
    }

    res.render('properties/viewproperty', {transactions: costArray, timeline: monthNames});
  });
});

module.exports = router;
