// Server.js
var app = require('./App');
var port = process.env.PORT || 5000;
var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});