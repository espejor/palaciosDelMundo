// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var users = require('../../app/controllers/users.server.controller'),
	pictures = require('../../app/controllers/pictures.server.controller');


// Definir el método routes de module
module.exports = function (app) {
	// Configurar la rutas base a 'pictures'  
	app.route('/api/pictures')
	   .get(pictures.list)
	   .post(users.requiresLogin, pictures.create);
	
	app.route('/api/pictures/upload')
		.post(pictures.upload);

	
	// Configurar las rutas 'palaces' parametrizadas
	app.route('/api/pictures/:pictureId')
	   .get(pictures.read)
	   .put(users.requiresLogin, pictures.hasAuthorization, pictures.update)
	   .delete(users.requiresLogin, pictures.hasAuthorization, pictures.delete);
	
	// Configurar el parámetro middleware 'palaceId'   
	app.param('pictureId', pictures.pictureByID);
};