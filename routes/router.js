module.exports = function (app, express, passport){

  // Requires
  var router = express.Router();

  // Model declarations
  var db = require('../models');
  var Photo = db.Photo;
  var User = db.User;

  // Authentication Router
  router.route('/gallery/new')
  .get(function (req, res) {
    console.log(req.user.dataValues);
    res.render('gallery-new');
  })
  .post(function (req, res, next) { // through form
    createPhoto(Photo, req, res);
  });

  router.post('/gallery', function (req, res) { // through postman
    createPhoto(Photo, req, res);
  });

  router.route('/gallery/:id/')
  .all(function (req, res, next) {
    if(!isNaN(parseInt(req.params.id))){
      next();
    } else {
      return next(req.params.id + ' does not exist.');
    }
  })
  .put(function (req, res, next) {
    updatePhoto(Photo, req.params.id, req, res, next);
  })
  .delete(function (req, res, next) {
    Photo.findById(req.params.id)
    .then( (photo) => {
      if(photo) { // if photo exists, delete photo
        res.render('gallery-delete', photo.dataValues);
        Photo.destroy({
          where: {
            id: req.params.id
          }
        });
      } else { // if photo doesn't exist
        return next('There is no Gallery Photo of ID: ' + req.params.id + '.');
      }
    });
  });

  router.route('/gallery/:id/edit')
  .all(function (req, res, next) {
    if(!isNaN(parseInt(req.params.id))){
      next();
    } else {
      return next(req.params.id + 'does not exist.');
    }
  })
  .get(function (req, res, next) {
    Photo.findById(req.params.id)
      .then( (photo) => {
        if(photo){ // if photo exists, get the picture
          res.render('gallery-edit', photo.dataValues);
        } else { // if photo doesn't exist
          return next('There is no Gallery Photo of ID: ' + req.params.id + '.');
        }
      });
  })
  .post(function (req, res, next) {
    updatePhoto(req.params.id, req, res, next);
  });

  router.use(function (err, req, res, next) {
      res.render('error', { message: err });
  });

  return router;
};

function createPhoto (Photo, req, res) {
  Photo.create( { url: req.body.url, description: req.body.description, user_id: req.user.dataValues.id } )
  .then( (photo) => {
    res.render('add-gallery', photo.dataValues);
  });
}

function updatePhoto (Photo, photoID, req, res, next) {
  Photo.findById(req.params.id)
    .then( (photo) => {
      if(photo) { // if photo exists, update the photo
        Photo.update( { url: req.body.url, description: req.body.description }, {
          where: {
            id: req.params.id
          }
        })
        .then( () => {
          Photo.findById(req.params.id)
          .then( (photo) => {
            res.render('update-gallery', photo.dataValues);
          });
        });
      } else { // if photo doesn't exist
        return next('There is no Gallery Photo of ID: ' + req.params.id + '.');
      }
    });
}