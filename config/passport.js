module.exports = function(passport, LocalStrategy, User, secret){

  passport.serializeUser(function (user, done) {
    var userID = user.dataValues.id;
    console.log('serialized...');
    return done(null, userID);
  });

  passport.deserializeUser(function (userID, done) {
    User.findById(userID)
    .then( (userFound) => {
      if(userFound) {
        console.log('deserialized...');
        return done(null, userFound);
      } else {
        return done(null, false);
      }
    });
  });

  passport.use(new LocalStrategy(
    function(user, pw, done) {
      User.findOne({
        where: { username : user, password: User.hashPassword(secret.Salt + pw) }
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

};