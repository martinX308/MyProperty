const express = require('express');
const router = express.Router();
const passport = require('passport');

// Link user model
const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res) => {
  if (req.user) {
    res.redirect('/properties/my-properties');
  }
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username }, 'username', (err, user, next) => {
    if (err) {
      return next(err);
    }
    if (user !== null) {
      res.render('auth/signup', { message: 'The username already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashPass
    });

    newUser.save((err, user) => {
      if (err) {
        res.render('auth/signup', { message: 'Something went wrong' });
      } else {
        req.login(user, function (err) {
          if (err) {
            return next(err);
          }
          res.redirect('/properties/my-properties');
        });
      }
    });
  });
});

// login ------------------- with passport
router.get('/', (req, res, next) => {
  if (req.user) {
    (req.user.role === 'Owner') ? res.redirect('/properties/my-properties') : res.redirect('/my-rent');
  }
  res.render('auth/login', {'message': req.flash('error')});
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/', // flash shows error message
  failureFlash: true,
  passReqToCallback: true
}), function (req, res) {
  req.user.role === 'Tenant' ? res.redirect('/my-rent') : res.redirect('/properties/my-properties');
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
