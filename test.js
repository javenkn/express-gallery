var db = require('./models');
db.sequelize.sync()
  .then(run);

function run () {
  var photo = db.Photo.findOne({
    include: [
      {model: db.User}
    ]
  });

  photo.then(function (photo) {
    console.log(photo);
  });
}