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
    Gallery.get(function (err, results) {
      var galleryEntries = JSON.parse(results);
      res.render('index', { entries: galleryEntries });
    });
  })
  .get('/gallery', function (req, res) {
    Gallery.get(function (err, results) {
      var galleryEntries = JSON.parse(results);
      res.render('index', { entries: galleryEntries });
    });
  })
  .get('/gallery/:id', function (req, res) {
    if(req.params.id === 'new') {
      res.render('gallery-new');
    } else if(!isNaN(parseInt(req.params.id))){
      Gallery.getID(req.params.id, function (err, result) {
        res.render('get-gallery', result);
      });
    } else {
        res.send('Cannot GET ' + req.params.id);
    }
  })
  .get('/gallery/:id/edit', function (req, res) {
    if(!isNaN(parseInt(req.params.id))){
      Gallery.getID(req.params.id, function (err, result) {
        res.render('gallery-edit', result);
      });
    } else {
        res.send('Cannot GET ' + req.params.id);
    }
  })
  .post('/gallery', urlencodedParser, function (req, res) {
    var locals = req.body;
    Gallery.create(locals, function (err, results) {
      res.render('add-gallery', results);
    });
  })
  .post('/gallery/:id', urlencodedParser, function (req, res) {
    var locals = req.body;
    if(req.params.id === 'new'){
      Gallery.create(locals, function (err, results) {
        res.render('add-gallery', results);
      });
    } else {
      res.send('Cannot POST to ' + '/gallery/' + req.params.id);
    }
  })
  .post('/gallery/:id/edit', urlencodedParser, function (req, res) {
    var locals = req.body;
    if(!isNaN(parseInt(req.params.id))){
      Gallery.update(req.params.id, locals, function (err, results) {
        res.render('update-gallery', results);
      });
    } else {
      res.send('Cannot POST to ' + '/gallery/' + req.params.id);
    }
  })
  .put('/gallery/:id', function (req, res) {
    if(!isNaN(parseInt(req.params.id))){
      Gallery.getID(req.params.id, function (err, results) {
        res.render('gallery-edit', results);
      });
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