'use strict';

require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('connect-flash');
const configurePassport = require('./helpers/passport');
const multer  = require('multer');

// -- require routes
const authRoute = require('./routes/authenticationControl');
const propRoute = require('./routes/propertyViews');
const apiRoute = require('./routes/api');
const tenantRoute = require('./routes/tenantViews');

const app = express();

// -- connect to mongo db
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

// -- view engine setup
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

// -- configure middlewares (static, session, cookies, body, ...)
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// -- setup session
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// - passport
configurePassport();
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// -- middleware after passport init, before routes > make user available globally
app.use(function (req, res, next) {
  app.locals.user = req.user;
  next();
});

app.use('/', authRoute);
app.use('/properties', propRoute);
app.use('/', apiRoute);
app.use('/', tenantRoute);

// -- 404 and error handler

app.use((req, res, next) => {
  res.status(404);
  res.render('not-found');
});

app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

module.exports = app;
