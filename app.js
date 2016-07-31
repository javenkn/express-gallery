// Requires
var pug = require('pug');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var router = require('./routes/router');
var app = express();

// Middleware
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.urlencoded ({ extended: false }));
app.use(methodOverride('_method'));
app.use('/user', router.forUsers);
app.use('/admin', router.forAdmin);

// Model declarations
var db = require('./models');
var Photo = db.Photo;
var User = db.User;

// Routes
app
  .get('/', function (req, res) {
    // console.log(req.user.username);
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
  })

  .get('/login', function (req, res) {
    res.render('login');
  })

  .get('/gallery', function (req, res) {
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
  });

module.exports = app;