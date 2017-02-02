'use strict';

var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function () {
	mongoose.Promise = global.Promise;
	var db = mongoose.connect(config.db);
	require('../app/models/user.server.model');
	require('../app/models/palace.server.model');
	return db;
}