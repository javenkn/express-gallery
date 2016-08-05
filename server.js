var app = require('./app');
var db = require('./models');

db.sequelize
  .sync()
  .then(function () {
    var server = app.listen(3000, function () {
      console.log(`Listening on port ${server.address().port}`);
    });
  })
  .catch(function (err) {
    return console.log(err);
  });