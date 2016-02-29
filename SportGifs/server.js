var express = require('express');
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
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
require('./app/routes/routes')(app);

/*
 * LISTEN 
 */

app.listen(port);
console.log('App listening on port ' + port);