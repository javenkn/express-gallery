var fs = require('fs');
var path = require('path');

module.exports = {
  create: addGallery,
  get: getGallery
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
    galleries.push(data); // why does it push _locals: {}
    fs.writeFile(JSON_DATA_PATH, JSON.stringify(galleries), callback);
  });
}
