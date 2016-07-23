var querystring = require('querystring');
var pug = require('pug');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var Gallery = require('./Gallery');

var app = express();

var count = 0;
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('view engine', 'pug');
app.use(methodOverride('_method'));

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
  .get('/gallery/:id', function (req, res, next) {
    if(req.params.id === 'new') {
      res.render('gallery-new');
    } else if(!isNaN(parseInt(req.params.id))){
      Gallery.getID(req.params.id, function (err, result) {
        if(err) return next(err);
        res.render('get-gallery', result);
        // Gallery.get(function (err, results) {
        //   var galleryEntries = JSON.parse(results);
        //   res.render('get-gallery', { entries: galleryEntries });
        // });
      });
    } else {
        res.send('Cannot GET ' + req.params.id);
    }
  })
  .get('/gallery/:id/edit', function (req, res, next) {
    if(!isNaN(parseInt(req.params.id))){
      Gallery.getID(req.params.id, function (err, result) {
        if(err) return next(err);
        res.render('gallery-edit', result);
      });
    } else {
        res.send('Cannot GET ' + req.params.id);
    }
  })
  .post('/gallery', urlencodedParser, function (req, res) {
    count++;
    var locals = req.body;
    Gallery.create(locals, count, function (err, results) {
      res.render('add-gallery', results);
    });
  })
  .post('/gallery/:id', urlencodedParser, function (req, res, next) {
    count++;
    var locals = req.body;
    if(req.params.id === 'new'){
      Gallery.create(locals, count, function (err, results) {
        if(err) return next(err);
        res.render('add-gallery', results);
      });
    } else {
      res.send('Cannot POST to ' + '/gallery/' + req.params.id);
    }
  })
  .post('/gallery/:id/edit', urlencodedParser, function (req, res, next) {
    var locals = req.body;
    if(!isNaN(parseInt(req.params.id))){
      Gallery.update(req.params.id, locals, function (err, results) {
        if(err) return next(err);
        res.render('update-gallery', results);
      });
    } else {
      res.send('Cannot POST to ' + '/gallery/' + req.params.id);
    }
  })
  .put('/gallery/:id', urlencodedParser, function (req, res, next) {
    var locals = req.body;
    if(!isNaN(parseInt(req.params.id))){
      Gallery.update(req.params.id, locals, function (err, results) {
        if(err) return next(err);
        res.render('update-gallery', results);
      });
    } else {
      res.send('Cannot PUT ' + req.params.id);
    }
  })
  .delete('/gallery/:id', function (req, res, next) {
    if(!isNaN(parseInt(req.params.id))){
        Gallery.delete(req.params.id, function (err, results) {
          if(err) return next(err);
          var removed = results[0];
          res.render('gallery-delete', removed);
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
});