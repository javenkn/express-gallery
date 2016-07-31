var app = require('./app');

var server = app.listen(3000, function () {
  console.log(`Listening on port ${server.address().port}`);
});