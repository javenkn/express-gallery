var fs = require('fs');
var path = require('path');

module.exports = {
  create: addGallery,
  get: getGallery,
  delete: deleteGallery
};

var JSON_DATA_PATH = path.resolve('data', 'gallery.json');

function getGallery(callback) {
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) return callback(err);
    callback(null, json);
  });
}

function addGallery(data, callback) {
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) throw err;
    var galleries = JSON.parse(json);
    var count = galleries.length+1;
    data.id = count;
    galleries.push(data);
    fs.writeFile(JSON_DATA_PATH, JSON.stringify(galleries), function (err) {
      if(err) return callback(err);
      callback(null, data);
    });
  });
}

function deleteGallery(idNumber, callback) {
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) throw err;
    var galleries = JSON.parse(json);
    var filteredGallery = galleries.filter(function (element, index, array) {
      return element.id !== idNumber;
    });
    console.log(filteredGallery);
  });
}