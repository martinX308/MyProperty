'use strict';

const express = require('express');
const router = express.Router();

// get helper middelware
const ensureloggedin = require('../helpers/ensureUserLoggedIn');

// get models
const Property = require('../models/property');
const User = require('../models/user');
const Post = require('../models/postings');

// --- show all properties for logged in user
router.get('/my-rent', ensureloggedin, (req, res, next) => {
  const userId = req.user._id;
  // res.render('tenant/myrent', { properties: undefined });
  // const test = Property.tenants.id(userId);
  // const populatedUser = Property.find().populate('tenants');

  Property.find({}, (err, foundProperties) => {
    if (err) {
      res.redirect('/');
    } else {
      let propertyArray = [];
      foundProperties.forEach(function (property) {
        var foundProperty = property.tenants.find(element => {
          return element.equals(userId);
        });
        if (foundProperty != undefined) {
          propertyArray.push(property);
        }
      });
      res.render('tenant/myrent', { properties: propertyArray });
    }
  });
});

// create posts
router.post('/my-rent/:userId/posts/new/:propertyId', (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId).exec((err, user) => {
    if (err) { return next(err); }

    const newPost = new Post({
      user_id: user._id,
      user_name: user.username,
      post: req.body.postText,
      propertyId: req.params.propertyId
    });

    newPost.save((err) => {
      if (err) {
        res.render('tenant/communication', {errorMessage: err.errors.post.message});
      } else {
        res.redirect('/my-rent');
      }
    });
  });
});

// show all posts
router.get('/my-rent/:propertyId/posts/show/', (req, res, next) => {
  const user = req.user._id;

  Post.find({propertyId: req.params.propertyId}, 'post user_name created_at').sort({ created_at: -1 }).exec((err, posting, next) => {
    if (err) { return next(err); }
    console.log(posting);
    res.render('tenant/communication', {posts: posting, propertyId: req.params.propertyId, role: 'my-rent'});
  });
});

module.exports = router;
