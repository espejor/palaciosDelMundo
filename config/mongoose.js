'use strict';

var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function () {
	mongoose.Promise = global.Promise;
	var db = mongoose.connect('mongodb://espejor:pepe05@ds139939.mlab.com:39939/palacesoftheworld');
	require('../app/models/user.server.model');
	require('../app/models/palace.server.model');
	return db;
}
