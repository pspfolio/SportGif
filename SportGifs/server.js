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

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

/*
 * ROUTES 
 */
require('./app/routes/routes')(app);

require('./app/cron/cronTimer')();
/*
 * LISTEN 
 */

app.listen(port);
console.log('App listening on port ' + port);