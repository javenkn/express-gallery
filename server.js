var express = require('express');
var gallery = express();

gallery
  .get('/', function (req, res) {
    res.send('List of gallery photos.');
  })
  .get('/gallery', function (req, res) {
    res.send('List of gallery photos.');
  })
  .get('/gallery/:id', function (req, res) {
    if(req.params.id === 'new') {
      res.send('Gallery submission form');
    } else {
      res.send('Single gallery of id: ' + req.params.id);
    }
  })
  .post('/gallery', function (req, res) {
    res.send('Create a photo.');
  })
  .put('/gallery/:id', function (req, res) {
    res.send('Update a photo.');
  })
  .delete('/gallery/:id', function (req, res) {
    res.send('Delete a photo.');
  });

gallery.listen(3000);