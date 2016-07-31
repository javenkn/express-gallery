// Requires
var express = require('express');
var app = express();
var router = express.Router();
var authRouter = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Middleware


// Passport middleware
passport.serializeUser(function (user, done) {
  var userID = user.dataValues.id;
  done(null, userID);
});

passport.deserializeUser(function (userID, done) {
  User.findById(userID)
  .then( (userFound) => {
    if(userFound) {
      done(null, userFound);
    } else {
      done(null, false);
    }
  });
});

passport.use(new LocalStrategy(
  function(user, pw, done) {
    User.findOne({
      where: { username : user, password: pw}
    })
    .then( (userFound) => {
      if(userFound){
        console.log('Found!');
        return done(null, userFound);
      } else {
        console.log('Back to login.');
        return done(null, false);
      }
    });
  })
);

app.use(passport.initialize());
app.use(passport.session());
authRouter.use(passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

authRouter.route('/gallery/:id/')
.post(function (req, res, next) {
  if(req.params.id === 'new'){ // if the id is new (user wants to post)
    Photo.create( { url: req.body.url, author: req.body.author, description: req.body.description} )
    .then( (photo) => {
      res.render('add-gallery', photo.dataValues);
    });
  } else {
    res.send('Cannot POST to ' + '/gallery/' + req.params.id);
  }
})
.put(function (req, res, next) {
  if(!isNaN(parseInt(req.params.id))){
    Photo.findById(req.params.id)
    .then( (photo) => {
      if(photo) { // if photo exists, update the photo
        Photo.update( { url: req.body.url, author: req.body.author, description: req.body.description }, {
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
  } else {
    res.send('Cannot PUT ' + req.params.id);
  }
})
.delete(function (req, res, next) {
  if(!isNaN(parseInt(req.params.id))){
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
  } else {
    res.send('Cannot DELETE ' + req.params.id);
  }
});

module.exports = {
  forUsers: authRouter,
  forAdmin: authRouter
};