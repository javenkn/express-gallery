var fs = require('fs');
var path = require('path');

module.exports = {
  create: addGallery,
  get: getGallery
};

var JSON_DATA_PATH = path.resolve('data', 'gallery.json');

function getGallery() {
  var galleries;
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) throw err;
    galleries = JSON.parse(json);
  });
}

function addGallery(data, callback) {
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) throw err;
    var galleries = JSON.parse(json);
    galleries.push(data);
    fs.writeFile(JSON_DATA_PATH, JSON.stringify(galleries));
  });
}
