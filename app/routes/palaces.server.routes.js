// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var users = require('../../app/controllers/users.server.controller'),
	palaces = require('../../app/controllers/palaces.server.controller'),
	pictures = require('../../app/controllers/pictures.server.controller');


// Definir el método routes de module
module.exports = function (app) {
	// Configurar la rutas base a 'palaces'  
	app.route('/api/palaces')
	   .get(palaces.list)
	   .post(users.requiresLogin, palaces.hasAuthorization, palaces.create);
	
	// Configurar las rutas 'palaces' parametrizadas
	app.route('/api/palaces/:palaceId')
	   .get(palaces.read)
	   .put(users.requiresLogin, palaces.hasAuthorization, palaces.update)
	   .delete(users.requiresLogin, palaces.hasAuthorization, palaces.delete);
	
	// Configurar el parámetro middleware 'palaceId'   
	app.param('palaceId', palaces.palaceByID);
};