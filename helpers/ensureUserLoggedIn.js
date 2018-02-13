const User = require('../models/user');

function ensureloggedin (req, res, next) {
  if (req.user) {
    return next();
  } else {
    res.redirect('/');
  }
}

module.exports = ensureloggedin;
