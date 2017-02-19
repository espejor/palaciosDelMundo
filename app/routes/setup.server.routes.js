// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var users = require('../../app/controllers/users.server.controller'),
	setup = require('../../app/controllers/setup.server.controller');


// Definir el método routes de module
module.exports = function (app) {
	// Configurar la rutas base a 'comments'  
	app.route('/api/setup')
	   .get(setup.list)
	   .put(setup.hasAuthorization, setup.update);

	// Configurar las rutas 'palaces' parametrizadas
	app.route('/api/setup/:setupId')
	   .get(setup.read)
	   .put(setup.hasAuthorization, setup.update);
	
	// Configurar el parámetro middleware 'palaceId'   
	app.param('setupId', setup.setupByID);
};