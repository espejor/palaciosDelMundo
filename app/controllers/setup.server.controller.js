// Invocar modo JavaScript 'strict' 
'use strict';

// Cargar las dependencias del módulo
var mongoose = require('mongoose'),
	path = require('path'),
	fs = require('fs'),
	Setup = mongoose.model('Setup');


// Crear un nuevo método controller para el manejo de setup
var getErrorMessage = function (err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Error de servidor desconocido';
	}
};


// Crear un nuevo método controller que recupera una lista de comentarios
exports.list = function (req, res) {
	// Usar el método model 'find' para obtener una lista de comentarios
	Setup.find().exec(function (err, setup) {
		if (err) {
			// Si un error ocurre enviar un mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(setup);
		}
	});
};



// Crear un nuevo método controller que devuelve un setup existente
exports.read = function (req, res) {
	res.json(req.setup);
};

// Crear un nuevo método controller que actualiza el setup existente
exports.update = function (req, res) {
	// Obtener el comentario usando el objeto 'request'
	var setup = req.setup;
	var files = req.files.files;
	var path = 'img/carousel';
	var picComments;
	var photo = {};
		
	// Actualizar los campos setup
	
	if (req.body.fields) {
		setup.initInfo = req.body.fields.initInfo;
		setup.photosCarousel = req.body.fields.photosCarousel ;
		picComments = req.body.fields.picComments;

	} else {
		setup.initInfo = req.body.initInfo;

	}
	
	
	// Cambiamos el nombre y la carpeta de los archivos almacenados y lo guardamos en la BD
	if (files) {
		for (var i = 0; i < files.length; i++) {
			var fileName = path + '/' + files[i].name;
			fs.rename(files[i].path, "public/" + fileName);
			photo.url = fileName;
			photo.title = picComments[i].title;
			photo.txt = picComments[i].txt;
			setup.photosCarousel.push(photo);	
		}
	}

	// Actualizar los campos comentario
	
	// Intentar salvar el comentario actualizado
	setup.save(function (err) {
		if (err) {
			// si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del setup
			res.json(setup);
		}
	});
};


// Crear un nuevo controller middleware que recupera un único setup existente
exports.setupByID = function (req, res, next, id) {
	// Usar el método model 'findById' para encontrar un único palacio 
	Setup.findById(id).exec(function (err, setup) {
		if (err) return next(err);
		if (!setup) return next(new Error('Fallo al cargar el setup ' + id));
		
		// Si un palacio es encontrado usar el objeto 'request' para pasarlo al siguietne middleware
		req.setup = setup;
		
		// Llamar al siguiente middleware
		next();
	});
};


// Crear un nuevo controller middleware que es usado para autorizar una operación comentario 
exports.hasAuthorization = function (req, res, next) {
	// si el usuario actual no es el creador del comentario, enviar el mensaje de error apropiado
	if (!req.user.isAdmin) { // sustituido (req.palace.creador.id !== req.user.id) por (false)
		return res.status(403).send({
			message: 'Usuario no está autorizado'
		});
	}
	
	// Llamar al siguiente middleware
	next();
};

