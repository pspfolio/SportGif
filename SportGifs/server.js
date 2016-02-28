var express = require('express');
var port = process.env.PORT || 3000;
var routes = require('./routes');
var user = require('./routes/user');

var app = express();
app.listen(port);

console.log('App listening on port ' + port);