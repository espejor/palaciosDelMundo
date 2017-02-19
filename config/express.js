var config = require('./config'),
	session = require('express-session'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	flash = require('connect-flash'),
	formidable = require("formidable"),
	util = require('util'),
	passport = require('passport');

var multipart = require('connect-multiparty');



module.exports = function () {
	var app = express();

	app.use(multipart({
		uploadDir: './public/img',
		keepExtensions: true,
		multiples: true
	}));

	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}
	//app.use(bodyParser({ defer: true }));
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	
	app.use(bodyParser.json());
	//app.use(bodyParser());
	app.use(methodOverride());
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));
	
	app.set('views', './app/views');
	app.set('view engine', 'ejs');
	
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());


	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);
	require('../app/routes/palaces.server.routes.js')(app);
	require('../app/routes/pictures.server.routes.js')(app);
	require('../app/routes/setup.server.routes.js')(app);
	require('../app/routes/comments.server.routes.js')(app);

	app.use(express.static('./public'));

    return app;
};