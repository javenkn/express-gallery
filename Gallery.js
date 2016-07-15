var fs = require('fs');
var path = require('path');

module.exports = {
  get: getGallery,
  getID: getSpecificGallery,
  create: addGallery,
  update: updateGallery,
  delete: deleteGallery
};

var JSON_DATA_PATH = path.resolve('data', 'gallery.json');

function getGallery(callback) {
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) return callback(err);
    callback(null, json);
  });
}

function getSpecificGallery(idNumber, callback) {
  var isFound = false;
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) return callback(err);
    var galleries = JSON.parse(json);
    galleries.forEach(function (element, index, array) {
      if(parseInt(element.id) === parseInt(idNumber)) {
        isFound = true;
        callback(null, element);
      }
    });
    if(!isFound){
      callback(new Error('Not Found'), null);
    }
  });
}

function addGallery(data, callback) {
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) throw err;
    var galleries = JSON.parse(json);
    var count = galleries.length+1; //fix id count
    data.id = count;
    galleries.push(data);
    fs.writeFile(JSON_DATA_PATH, JSON.stringify(galleries), function (err) {
      if(err) return callback(err);
      callback(null, data);
    });
  });
}

function updateGallery(idNumber, data, callback) {
  var isFound = false;
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) throw err;
    var galleries = JSON.parse(json);
    galleries.forEach(function (element, index, array) {
      if(element.id === parseInt(idNumber)) {
        isFound = true;
        data.id = parseInt(idNumber);
        galleries.splice(index,1, data);
      }
    });
    if(!isFound){
      callback(new Error('Not Found'), null);
    } else {
      fs.writeFile(JSON_DATA_PATH, JSON.stringify(galleries), function (err) {
        if(err) return callback(err);
        callback(null, data);
      });
    }
  });
}

function deleteGallery(idNumber, callback) {
  var isFound = false;
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) throw err;
    var galleries = JSON.parse(json);
    var removedGallery;
    galleries.forEach(function (element, index, array) {
      if(element.id === parseInt(idNumber)) {
        isFound = true;
        removedGallery = galleries.splice(index,1);
      }
    });
    if(!isFound){
      callback(new Error('Not Found'), null);
    } else {
      fs.writeFile(JSON_DATA_PATH, JSON.stringify(galleries), function (err) {
        if(err) return callback(err);
        callback(null, removedGallery);
      });
    }
  });
}