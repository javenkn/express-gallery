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
  store: new RedisStore({}),
  resave: true,
  saveUninitialized: false,
  secret: 'keyboardcat'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/user', ensureAuthentication, router(app, express, passport));

// Routes
app
  .get('/', function (req, res) {
    console.log(req.isAuthenticated());
    displayAllPhotos(res);
  })
  .get('/user/login', function (req, res) {
    res.render('login');
  })
  .get('/gallery', function (req, res) {
    displayAllPhotos(res);
  })
  .get('/user/gallery/:id', function (req, res, next) {
    if(!isNaN(parseInt(req.params.id))){
      var getPhoto = Photo.findById(req.params.id);
      var getThreePhotos = Photo.findAll({
        limit: 3,
        where: {
          id: { ne: req.params.id }
        }
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
  }
  return res.redirect('/');
}

function displayAllPhotos (res) {
  Photo.findAll({
        order: 'id ASC'
      })
      .then( (photos) => {
        if(photos) { // if photos exists, get the gallery
          var galleryOfPhotos = [];
          photos.forEach(function (element) {
            galleryOfPhotos.push(element.dataValues);
          });
          res.render('index', { entries: galleryOfPhotos });
        } else {
          return next('There are no pictures in the gallery.');
        }
      });
}

module.exports = app;