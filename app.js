// Requires
var pug = require('pug');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var router = require('./routes/router');
var redis = require('connect-redis');

var RedisStore = redis(session);
var app = express();

// Model declarations
var db = require('./models');
var Photo = db.Photo;
var User = db.User;
require('./config/passport.js')(passport, LocalStrategy, User);

// Middleware
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.urlencoded ({ extended: false }));
app.use(methodOverride('_method'));
app.use(session( {
  store: new RedisStore({
    ttl: 60
  }),
  resave: true,
  saveUninitialized: false,
  secret: 'keyboardcat'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/user', ensureAuthentication, router(app, express, passport));

// Routes

app.route('/login')
.get(function (req, res) {
    console.log(req.session.successPath);
    res.render('login');
})
.post(function (req, res, next) {
  passport.authenticate('local', function (err, user) {
    if(err) { return next(err); }
    if(!user) {
      return res.render('login', { message : 'Invalid username/password. Please try again.' });
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      if(req.session.successPath){
        return res.redirect(req.session.successPath);
      } else {
        return res.redirect('/');
      }
    });
  })(req, res, next);
});

app.route('/register')
.get(function (req, res) {
  res.render('register');
})
.post(function (req, res, next) {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
  .then( (user) => {
    if(!user){
      User.create({ username: req.body.username, password: req.body.password })
      .then((user) => {
        res.render('login', { message : 'Please login to authenticate your account.'});
      });
    } else {
      res.render('register', { message : 'You cannot have the same username as another user.' });
    }
  });
});

app
  .get('/', function (req, res) { // index
    console.log(req.isAuthenticated()); // checks if user is authenticated
    displayAllPhotos(res);
  })
  .get('/gallery', function (req, res) { // gallery
    delete req.session.successPath;
    displayAllPhotos(res);
  })
  .get('/logout', function (req, res) { // logout
    delete req.session.successPath;
    req.logout();
    res.redirect('/');
  })
  .get('/gallery/:id', function (req, res, next) { // individual gallery
    if(!isNaN(parseInt(req.params.id))){
      var getPhoto = Photo.findById(req.params.id, {
        include: [{
          model: User,
          as: 'user',
          required: true
        }]
      });
      var getThreePhotos = Photo.findAll({
        limit: 3,
        where: {
          id: { ne: req.params.id }
        },
        include: [{
          model: User,
          as: 'user',
          required: true
        }]
      });
      Promise.all([getPhoto, getThreePhotos])
      .then( (results) => {
        if(results[0]){ // if the photo exists, get the picture and the three side pics
          res.render('get-gallery', {
            photo: results[0],
            entries: results[1]
          });
        } else { // if the photo doesn't exist
          return next('There is no Gallery Photo of ID: ' + req.params.id + '.');
        }
      });
    } else {
        res.send('Cannot GET ' + req.params.id);
    }
  });

app.use(function (err, req, res, next) {
      res.render('error', { message: err });
  });

function ensureAuthentication (req, res, next) {
  if(req.isAuthenticated()) {
    console.log('User is authenticated...');
    return next();
  } else {
    req.session.successPath = req.originalUrl;
    return res.redirect('/login');
  }
}

function displayAllPhotos (res) {
  Photo.findAll({
    order: 'id ASC',
    include: [{
      model: User,
      as: 'user',
      required: true
    }]
  })
  .then( (photos) => {
    if(photos) { // if photos exists, get the gallery
      res.render('index', { entries: photos });
    } else {
      return next('There are no pictures in the gallery.');
    }
  });
}

module.exports = app;