// Invocar modo JavaScript 'strict' 
'use strict';

// Cargar las dependencias del módulo
var mongoose = require('mongoose'),
	Comment = mongoose.model('Comment'),
	Palace = mongoose.model('Palace');


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

// Crear un nuevo método controller para crear nuevos comentarios
exports.create = function (req, res) {
	// Crear un nuevo objeto comentario
	var comment = new Comment(req.body);

	comment.author = req.user;	
	
	// Intentar salvar el comentario
	comment.save(function (err) {
		if (err) {
			// Si ocurre algún error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(comment);
		}
	});

	Palace.findById(req.body.palace, function (error, palace) {
		if (error) return res.status(500).send(error);
		palace.comments.push(comment);
		palace.save();
	});
};


// Crear un nuevo método controller que recupera una lista de comentarios
exports.list = function (req, res) {
	// Usar el método model 'find' para obtener una lista de comentarios
	Comments.find().sort('-date').populate('palace author').exec(function (err, comments) {
		if (err) {
			// Si un error ocurre enviar un mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(comments);
		}
	});
};


// Crear un nuevo método controller que devuelve un comentario existente
exports.read = function (req, res) {
	res.json(req.comment);
};

// Crear un nuevo método controller que actualiza un comentario existente
exports.update = function (req, res) {
	// Obtener el comentario usando el objeto 'request'
	var comment = req.comment;
	
	// Actualizar los campos comentario
	comment.palace = req.body.palace;
	comment.author = req.body.author;
	comment.date = req.body.date;
	comment.customerRate = req.body.customerRate;
	comment.titule = req.body.titule;
	comment.text = req.body.text;
	
	
	// Intentar salvar el comentario actualizado
	comment.save(function (err) {
		if (err) {
			// si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del comentario
			res.json(comment);
		}
	});
};

// Crear un nuevo método controller que borre un comentario existente
exports.delete = function (req, res) {
	// Obtener el comentario usando el objeto 'request'
	var comment = req.comment;
	
	// Usar el método model 'remove' para borrar el comentario
	comment.remove(function (err) {
		if (err) {
			// Si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del comentario 
			res.json(comment);
		}
	});
};



// Crear un nuevo controller middleware que recupera un único comentario existente
exports.commentByID = function (req, res, next, id) {
	// Usar el método model 'findById' para encontrar un único comentario 
	Comment.findById(id).populate('palace author').exec(function (err, comment) {
		if (err) return next(err);
		if (!comment) return next(new Error('Fallo al cargar el comentario' + id));
		
		// Si un comentario es encontrado usar el objeto 'request' para pasarlo al siguietne middleware
		req.comment = comment;
		
		// Llamar al siguiente middleware
		next();
	});
};


// Crear un nuevo controller middleware que es usado para autorizar una operación comentario 
exports.hasAuthorization = function (req, res, next) {
	// si el usuario actual no es el creador del comentario, enviar el mensaje de error apropiado
	if (req.comment.author.id !== req.user.id) { // sustituido (req.palace.creador.id !== req.user.id) por (false)
		return res.status(403).send({
			message: 'Usuario no está autorizado'
		});
	}
	
	// Llamar al siguiente middleware
	next();
};

