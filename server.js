// requires
var querystring = require('querystring');
var pug = require('pug');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

var db = require('./models');

var app = express();
var Photo = db.Photo;
var User = db.User;

// middleware
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session( {
  resave: true,
  saveUninitialized: false,
  secret: 'keyboardcat'
}));

// Other middleware
passport.serializeUser(function (user, done) {
  var userID = user.dataValues.id;
  done(null, userID);
});

passport.deserializeUser(function (userID, done) {
  User.findById(userID)
  .then( (userFound) => {
    if(userFound) {
      done(null, userFound);
    } else {
      done(null, false);
    }
  });
});

passport.use(new LocalStrategy(
  function(user, pw, done) {
    User.findOne({
      where: { username : user, password: pw}
    })
    .then( (userFound) => {
      if(userFound){
        console.log('Found!');
        return done(null, userFound);
      } else {
        console.log('Back to login.');
        return done(null, false);
      }
    });
  })
);

app.use(passport.initialize());
app.use(passport.session());

// routes
// non authentication
app
  .get('/', function (req, res) {
    console.log(req.user.username);
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
  })
  .get('/gallery/new', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }), function (req, res) {
      res.render('gallery-new');
  })
  .get('/gallery/:id', function (req, res, next) {
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

// need authentication
app
  .get('/gallery/:id/edit', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }), function (req, res, next) {
    if(!isNaN(parseInt(req.params.id))){
      Photo.findById(req.params.id)
      .then( (photo) => {
        if(photo){ // if photo exists, get the picture
          res.render('gallery-edit', photo.dataValues);
        } else { // if photo doesn't exist
          return next('There is no Gallery Photo of ID: ' + req.params.id + '.');
        }
      });
    } else {
        res.send('Cannot GET ' + req.params.id);
    }
  })
  .post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }), function (req, res) {
  })
  .post('/gallery', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }), function (req, res) { // creates a new photo to the gallery
    Photo.create( { url: req.body.url, author: req.body.author, description: req.body.description} )
    .then( (photo) => {
      res.render('add-gallery', photo.dataValues);
    });
  })
  .post('/gallery/:id', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }), function (req, res, next) {
    if(req.params.id === 'new'){ // if the id is new (user wants to post)
      Photo.create( { url: req.body.url, author: req.body.author, description: req.body.description} )
      .then( (photo) => {
        res.render('add-gallery', photo.dataValues);
      });
    } else {
      res.send('Cannot POST to ' + '/gallery/' + req.params.id);
    }
  })
  .post('/gallery/:id/edit', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }), function (req, res, next) {
    if(!isNaN(parseInt(req.params.id))){
      Photo.findById(req.params.id)
      .then( (photo) => {
        if(photo) { // if photo exists, update the photo
          Photo.update( { url: req.body.url, author: req.body.author, description: req.body.description }, {
            where: {
              id: req.params.id
            }
          })
          .then( () => {
            Photo.findById(req.params.id)
            .then( (photo) => {
              res.render('update-gallery', photo.dataValues);
            });
          });
        } else { // if photo doesn't exist
          return next('There is no Gallery Photo of ID: ' + req.params.id + '.');
        }
      });
    } else {
      res.send('Cannot POST to ' + '/gallery/' + req.params.id);
    }
  })
  .put('/gallery/:id', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }), function (req, res, next) {
    if(!isNaN(parseInt(req.params.id))){
      Photo.findById(req.params.id)
      .then( (photo) => {
        if(photo) { // if photo exists, update the photo
          Photo.update( { url: req.body.url, author: req.body.author, description: req.body.description }, {
            where: {
              id: req.params.id
            }
          })
          .then( () => {
            Photo.findById(req.params.id)
            .then( (photo) => {
              res.render('update-gallery', photo.dataValues);
            });
          });
        } else { // if photo doesn't exist
          return next('There is no Gallery Photo of ID: ' + req.params.id + '.');
        }
      });
    } else {
      res.send('Cannot PUT ' + req.params.id);
    }
  })
  .delete('/gallery/:id', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }), function (req, res, next) {
    if(!isNaN(parseInt(req.params.id))){
      Photo.findById(req.params.id)
      .then( (photo) => {
        if(photo) { // if photo exists, delete photo
          res.render('gallery-delete', photo.dataValues);
          Photo.destroy({
            where: {
              id: req.params.id
            }
          });
        } else { // if photo doesn't exist
          return next('There is no Gallery Photo of ID: ' + req.params.id + '.');
        }
      });
    } else {
      res.send('Cannot DELETE ' + req.params.id);
    }
  });

  app.use(function (err, req, res, next) {
    res.render('error', { message: err });
  });

var server = app.listen(3000, function () {
  console.log(`Listening on port ${server.address().port}`);
  db.sequelize.sync();
});