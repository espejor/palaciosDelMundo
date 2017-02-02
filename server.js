process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport');

const port = process.env.PORT || 3000;
var db = mongoose();
var app = express();
var passport = passport();

app.listen(port);
module.exports = app;

console.log('Servidor ejecutándose en http://localhost:3000/');
