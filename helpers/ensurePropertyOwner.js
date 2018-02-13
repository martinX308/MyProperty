const Property = require('../models/property');

function ensureOwner (req, res, next) {
  Property.findById(req.params.id, (err, property) => {
    // If there's an error, or no property identified forward
    if (err) { return next(err); }
    // If there is no campaign, return a 404?
    if (property === undefined) { return next(err); }

    // If the campaign belongs to the user, next()
    if (property.owner.equals(req.user._id)) {
      return next();
    } else {
      // Otherwise, redirect
      return res.redirect('/properties/my-properties');
    }
  });
}

module.exports = ensureOwner;
