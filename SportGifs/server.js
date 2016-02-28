var express = require('express');
var port = process.env.PORT || 3000;
var mongoos = require('mongoose');
var bodyParser = require('body-parser');
var routes = require('./routes');
var user = require('./routes/user');
var app = express();

/*
 * EXPRESS.JS CONFIGURE
 */

// connection to mongodb
mongoose.connect('mongodb://localhost:27017');
app.use(bodyParser.json()); 

/*
 * ROUTES 
 */


/*
 * LISTEN 
 */

app.listen(port);
console.log('App listening on port ' + port);