var querystring = require('querystring');
var pug = require('pug');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var Gallery = require('./Gallery');

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

app
  .get('/', function (req, res) {
    Gallery.get(function (err, result) {
      var galleryEntries = JSON.parse(result);
      res.render('index', { entries: galleryEntries });
    });
  })
  .get('/gallery', function (req, res) {
    Gallery.get(function (err, result) {
      var galleryEntries = JSON.parse(result);
      res.render('index', { entries: galleryEntries });
    });
  })
  .get('/gallery/:id', function (req, res) {
    if(req.params.id === 'new') {
      res.render('gallery-new');
    } else {
      if(!isNaN(parseInt(req.params.id))){
        res.send('Single gallery of id: ' + req.params.id);
      } else {
        res.send('Cannot GET ' + req.params.id);
      }
    }
  })
  .post('/gallery', urlencodedParser, function (req, res) {
    var locals = req.body;
    Gallery.create(locals, function (err, results) {
      res.render('gallery', results);
    });
  })
  .post('/gallery/:id', urlencodedParser, function (req, res) {
    var locals = req.body;
    if(req.params.id === 'new'){
      Gallery.create(locals, function (err, results) {
        res.render('gallery', results);
      });
    } else {
      res.send('Cannot POST to ' + '/gallery/' + req.params.id);
    }
  })
  .put('/gallery/:id', urlencodedParser, function (req, res) {
    var locals = req.body;
    if(!isNaN(parseInt(req.params.id))){
      res.render('gallery-edit', locals);
    } else {
      res.send('Cannot PUT ' + req.params.id);
    }
  })
  .delete('/gallery/:id', function (req, res) {
    if(!isNaN(parseInt(req.params.id))){
        Gallery.delete(req.params.id, function (err, results) {
          Gallery.get(function (err, results) {
            var galleryEntries = JSON.parse(results);
            console.log(galleryEntries);
            console.log(results);
            res.render('index', { entries: galleryEntries });
          });
        });
    } else {
      res.send('Cannot DELETE ' + req.params.id);
    }
  });

var server = app.listen(3000, function () {
  console.log(`Listening on port ${server.address().port}`);
});