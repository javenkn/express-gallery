// Model declarations
var db = require('../models');
var Photo = db.Photo;
var User = db.User;

module.exports = function (app, express, passport){

  // Requires
  var router = express.Router();

  // Authentication Router
  router.route('/gallery/new') // creating new gallery
  .get(function (req, res) {
    res.render('gallery-new');
  })
  .post(function (req, res, next) { // through input form
    createPhoto(req, res);
  });

  router.post('/gallery', function (req, res) { // through postman
    createPhoto(req, res);
  });

  router.route('/gallery/:id/') // changing an individual gallery
  .all(function (req, res, next) {
    if(!isNaN(parseInt(req.params.id))){
      next();
    } else {
      return next(req.params.id + ' does not exist.');
    }
  })
  .put(function (req, res, next) { // editing content of a photo
    updatePhoto(req, res, next);
  })
  .delete(function (req, res, next) { // deleting a photo
    Photo.findById(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        required: true
      }]
    })
    .then( (photo) => {
      if(photo) { // if photo exists, delete photo
        if(photo.user.username === req.user.username) {
        // check if req user is the same as the photo user
          res.render('gallery-delete', photo.toJSON());
          Photo.destroy({
            where: {
              id: req.params.id
            }
          });
        } else { // req user isn't the same as the photo user
          photo.dataValues.message = 'You do not have permission to delete this photo.';
          res.render('gallery-edit', photo.toJSON());
        }
      } else { // if photo doesn't exist
        return next('There is no Gallery Photo of ID: ' + req.params.id + '.');
      }
    });
  });

  router.route('/gallery/:id/edit') // editing a single gallery
  .all(function (req, res, next) {
    if(!isNaN(parseInt(req.params.id))){
      next();
    } else {
      return next(req.params.id + 'does not exist.');
    }
  })
  .get(function (req, res, next) {
    Photo.findById(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        required: true
      }]
    })
    .then( (photo) => {
      if(photo){ // if photo exists, get the picture
        res.render('gallery-edit', photo.toJSON());
      } else { // if photo doesn't exist
        return next('There is no Gallery Photo of ID: ' + req.params.id + '.');
      }
    });
  })
  .post(function (req, res, next) { // through postman
    updatePhoto(req, res, next);
  });

  router.use(function (err, req, res, next) {
    res.render('error', { message: err });
  });

  return router;
};

function createPhoto (req, res) {
  Photo.create( { url: req.body.url, description: req.body.description, user_id: req.user.id } )
  .then( (photo) => {
    photo.dataValues.username = req.user.username;
    res.render('add-gallery', photo.toJSON());
  });
}

function updatePhoto (req, res, next) {
  Photo.findById(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        required: true
      }]
    })
    .then( (photo) => {
      if(photo) { // if photo exists, update the photo
        if(photo.user.username === req.user.username) {
          // check if req user is the same as the photo user
          Photo.update( { url: req.body.url, description: req.body.description }, {
            where: {
              id: req.params.id
            }
          })
          .then( () => {
            Photo.findById(req.params.id, {
              include: [{
                model: User,
                as: 'user',
                required: true
              }]
            })
            .then( (photo) => {
              res.render('update-gallery', photo.toJSON());
            });
          });
        } else { // req user isn't the same as the photo user
          photo.dataValues.message = 'You do not have permission to update this photo.';
          res.render('gallery-edit', photo.toJSON());
        }
      } else { // if photo doesn't exist
        return next('There is no Gallery Photo of ID: ' + req.params.id + '.');
      }
    });
}