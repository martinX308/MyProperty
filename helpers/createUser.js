// Link user model
const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

function createUser (userData, callback) {
  const username = userData.username;
  const password = userData.password;
  const email = userData.email;
  const role = userData.role;
  let returnMessage = {status: true, message: '', user: ''};

  User.findOne({ username }, 'username', (err, user, next) => {
    if (err) {
      returnMessage.status = false;
      returnMessage.message = err;
      callback(returnMessage);
    } else if (user !== null) {
      returnMessage.status = false;
      returnMessage.message = 'The username already exists';
      callback(returnMessage);
    } else {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashPass,
        role
      });

      newUser.save((err, user) => {
        if (err) {
          returnMessage.status = false;
          returnMessage.message = 'Something went wrong';
        } else {
          returnMessage.message = 'User created';
          returnMessage.user = user._id;
        }
        callback(returnMessage);
      });
    }
  });
}

module.exports = createUser;
