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
  .post(function (req, res, next) { // through form
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
  .put(function (req, res, next) {
    updatePhoto(req, res, next);
  })
  .delete(function (req, res, next) {
    Photo.findById(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        required: true
      }]
    })
    .then( (photo) => {
      if(photo) { // if photo exists, delete photo
        res.render('gallery-delete', photo.toJSON());
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

  router.route('/gallery/:id/edit') // editing a single gallery
  .all(function (req, res, next) {
    if(!isNaN(parseInt(req.params.id))){
      next();
    } else {
      return next(req.params.id + 'does not exist.');
    }
  })
  .get(function (req, res, next) {
    console.log(req.params.id);
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
  .post(function (req, res, next) {
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
  Photo.findById(req.params.id)
    .then( (photo) => {
      if(photo) { // if photo exists, update the photo
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
      } else { // if photo doesn't exist
        return next('There is no Gallery Photo of ID: ' + req.params.id + '.');
      }
    });
}