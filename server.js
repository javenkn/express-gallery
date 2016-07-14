var querystring = require('querystring');
var pug = require('pug');
var express = require('express');
var path = require('path');

var Gallery = require('./Gallery');

var app = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

app
  .get('/', function (req, res) {
    res.render('index');
  })
  .get('/gallery', function (req, res) {
    Gallery.get(function (err, result) {
      var galleryEntries = JSON.parse(result);
      console.log(galleryEntries);
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
  .post('/gallery', function (req, res) {
    req.on('data', function (data) {
      var locals = querystring.parse(data.toString());
      Gallery.create(locals);
      res.render('gallery', locals);
    });
  })
  .post('/gallery/:id', function (req, res) {
    req.on('data', function (data) {
      var locals = querystring.parse(data.toString());
      if(req.params.id === 'new'){
        Gallery.create(locals);
        res.render('gallery', locals);
      } else {
        res.send('Cannot POST to ' + '/gallery/' + req.params.id);
      }
    });
    // req.on('end', function () {
    //   var values = querystring.parse(postData);
    //   var author = values.author;
    //   var url = values.url;
    //   var description = values.description;
    //   res.send('Creating a gallery with ' + author + ', ' + url + ', ' +
    //     description);
    // });

  })
  .put('/gallery/:id', function (req, res) {
    var putData = '';
    req.on('data', function (data) {
      putData += data;
    });

    req.on('end', function () {
      if(!isNaN(parseInt(req.params.id))){
        var values = querystring.parse(putData);
        var author = values.author;
        var url = values.url;
        var description = values.description;
        res.send('Updating a gallery with ' + author + ', ' + url + ', ' +
          description);
      } else {
        res.send('Cannot PUT ' + req.params.id);
      }
    });
  })
  .delete('/gallery/:id', function (req, res) {
    if(!isNaN(parseInt(req.params.id))){
        res.send('Deleting gallery of id: ' + req.params.id);
    } else {
      res.send('Cannot DELETE ' + req.params.id);
    }
  });

var server = app.listen(3000, function () {
  console.log(`Listening on port ${server.address().port}`);
});