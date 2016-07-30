var querystring = require('querystring');
var pug = require('pug');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var db = require('./models');

var app = express();
var Photo = db.Photo;

app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('view engine', 'pug');
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app
  .get('/', function (req, res) {
    Photo.findAll({
      order: 'id ASC'
    })
    .then( (photos) => {
      if(photos) {
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
  .get('/gallery', function (req, res) {
    Photo.findAll({
      order: 'id ASC'
    })
    .then( (photos) => {
      if(photos) {
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
  .get('/gallery/:id', function (req, res, next) {
    if(req.params.id === 'new') {
      res.render('gallery-new');
    } else if(!isNaN(parseInt(req.params.id))){
      var getPhoto = Photo.findById(req.params.id);
      var getThreePhotos = Photo.findAll({
        limit: 3,
        where: {
          id: { ne: req.params.id }
        }
      });
      Promise.all([getPhoto, getThreePhotos])
      .then( (results) => {
        if(results[0]){
          res.render('get-gallery', {
            photo: results[0],
            entries: results[1]
          });
        } else {
          return next('There is no Gallery Photo of ID: ' + req.params.id + '.');
        }
      });
    } else {
        res.send('Cannot GET ' + req.params.id);
    }
  })
  .get('/gallery/:id/edit', function (req, res, next) {
    if(!isNaN(parseInt(req.params.id))){
      Photo.findById(req.params.id)
      .then( (photo) => {
        if(photo){
          res.render('gallery-edit', photo.dataValues);
        } else {
          return next('There is no Gallery Photo of ID: ' + req.params.id + '.');
        }
      });
    } else {
        res.send('Cannot GET ' + req.params.id);
    }
  })
  .post('/gallery', function (req, res) {
    Photo.create( { url: req.body.url, author: req.body.author, description: req.body.description} )
    .then( (photo) => {
      res.render('add-gallery', photo.dataValues);
    });
  })
  .post('/gallery/:id', function (req, res, next) {
    if(req.params.id === 'new'){
      Photo.create( { url: req.body.url, author: req.body.author, description: req.body.description} )
      .then( (photo) => {
        res.render('add-gallery', photo.dataValues);
      });
    } else {
      res.send('Cannot POST to ' + '/gallery/' + req.params.id);
    }
  })
  .post('/gallery/:id/edit', function (req, res, next) {
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
  .put('/gallery/:id', function (req, res, next) {
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
  .delete('/gallery/:id', function (req, res, next) {
    if(!isNaN(parseInt(req.params.id))){
      Photo.findById(req.params.id)
      .then( (photo) => {
        if(photo) {
          res.render('gallery-delete', photo.dataValues);
          Photo.destroy({
            where: {
              id: req.params.id
            }
          });
        } else {
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