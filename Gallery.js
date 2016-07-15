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
    galleries.forEach(function (element, index, array) {
      if(element.id === parseInt(idNumber)) {
        galleries.splice(index,1);
      }
    });
    fs.writeFile(JSON_DATA_PATH, JSON.stringify(galleries), function (err) {
      if(err) return callback(err);
      callback(null, galleries);
    });
  });
}