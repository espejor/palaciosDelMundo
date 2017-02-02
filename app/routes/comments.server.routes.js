// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var users = require('../../app/controllers/users.server.controller'),
	comments = require('../../app/controllers/comments.server.controller');


// Definir el método routes de module
module.exports = function (app) {
	// Configurar la rutas base a 'comments'  
	app.route('/api/comments')
	   .get(comments.list)
	   .post(users.requiresLogin, comments.create);
	
	// Configurar las rutas 'palaces' parametrizadas
	app.route('/api/comments/:commentId')
	   .get(comments.read)
	   .put(users.requiresLogin, comments.hasAuthorization, comments.update)
	   .delete(users.requiresLogin, comments.hasAuthorization, comments.delete);
	
	// Configurar el parámetro middleware 'palaceId'   
	app.param('commentId', comments.commentByID);
};