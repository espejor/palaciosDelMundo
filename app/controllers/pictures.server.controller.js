// Invocar modo JavaScript 'strict' 
'use strict';

// Cargar las dependencias del módulo
var mongoose = require('mongoose'),
	Picture = mongoose.model('Picture'),
	//formidable = require('formidable'),
	path = require('path'),
	fs = require('fs');


// Crear un nuevo método controller para el manejo de errores
var getErrorMessage = function (err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Error de servidor desconocido';
	}
};

// Crear un nuevo método controller para crear nuevos fotos
exports.create = function (req, res) {
	// Crear un nuevo objeto foto
	var picture = new Picture(req.body);
	
	// Intentar salvar la foto
	picture.save(function (err) {
		if (err) {
			// Si ocurre algún error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(picture);
		}
	});
};

exports.upload = function (req, res,next) {
	// creamos un objeto IncomingForm de formidable
	var form = new formidable.IncomingForm();
	
//	var form = req.form;
	form
    .on('error', function (err) {
		throw err;
	})

    .on('field', function (field, value) {
		console.log('field');
	})

    .on('fileBegin', function (name, file) {
		console.log('fileBegin');

	})
    .on('file', function (field, file) {
		console.log('file');
	})

    .on('progress', function (bytesReceived, bytesExpected) {
		
		var percent = (bytesReceived / bytesExpected * 100) | 0;
		console.log('Uploading: %' + percent + '\r');
	})

    .on('end', function () {
		console.log('end');


	});

	// Llamar al siguiente middleware
	next();
};

// Crear un nuevo método controller que recupera una lista de fotos
exports.list = function (req, res) {
	// Usar el método model 'find' para obtener una lista de fotos
	Pictures.find().populate('palace').exec(function (err, pictures) {
		if (err) {
			// Si un error ocurre enviar un mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(pictures);
		}
	});
};


// Crear un nuevo método controller que devuelve un foto existente
exports.read = function (req, res) {
	res.json(req.picture);
};

// Crear un nuevo método controller que actualiza un foto existente
exports.update = function (req, res) {
	// Obtener el foto usando el objeto 'request'
	var picture = req.picture;
	
	// Actualizar los campos foto
	picture.palace = req.body.palace;
	picture.url = req.body.url;
	
	
	// Intentar salvar el foto actualizado
	picture.save(function (err) {
		if (err) {
			// si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del foto
			res.json(picture);
		}
	});
};

// Crear un nuevo método controller que borre un foto existente
exports.delete = function (req, res) {
	// Obtener el foto usando el objeto 'request'
	var picture = req.picture;
	
	// Usar el método model 'remove' para borrar el foto
	picture.remove(function (err) {
		if (err) {
			// Si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del foto 
			if (fs.existsSync('public/' + picture.url))
				fs.unlink('public/' + picture.url);

			res.json(picture);
		}
	});
};



// Crear un nuevo controller middleware que recupera un único foto existente
exports.pictureByID = function (req, res, next, id) {
	// Usar el método model 'findById' para encontrar un único foto 
	Picture.findById(id).populate('palace').exec(function (err, picture) {
		if (err) return next(err);
		if (!picture) return next(new Error('Fallo al cargar la foto' + id));
		
		// Si un foto es encontrado usar el objeto 'request' para pasarlo al siguietne middleware
		req.picture = picture;
		
		// Llamar al siguiente middleware
		next();
	});
};


// Crear un nuevo controller middleware que es usado para autorizar una operación foto 
exports.hasAuthorization = function (req, res, next) {
	// si el usuario actual no es el creador del foto, enviar el mensaje de error apropiado
	if (!req.user.isAdmin) { // sustituido (req.palace.creador.id !== req.user.id) por (false)
		return res.status(403).send({
			message: 'Usuario no está autorizado'
		});
	}
	
	// Llamar al siguiente middleware
	next();
};

