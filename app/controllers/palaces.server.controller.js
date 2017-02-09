// Invocar modo JavaScript 'strict' 
'use strict';

// Cargar las dependencias del módulo
var mongoose = require('mongoose'),
	formidable = require('formidable'),
	Picture = mongoose.model('Picture'),
	Palace = mongoose.model('Palace'),
	Comment = mongoose.model('Comment'),
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

// Crear un nuevo método controller para crear nuevos palacios
exports.create = function (req, res) {
	
	var files = req.files.files;
	var country = req.body.fields.country;
	var town = req.body.fields.town;
	var comments = req.body.fields.comments;

	// Crear un nuevo objeto palace con los datos del form
	//Antes le quitamos el campo comments que no forma parte de un objeto Palace

	delete req.body.fields.comments;
	var palace = new Palace(req.body.fields);
	
	// Creamos el directorio donde se almacenará la imagen
	var path = 'img/' + country;	
	if (!fs.existsSync("public/" + path))
		fs.mkdirSync("public/" + path);
	path += '/' + town;
	if (!fs.existsSync("public/" + path))
		fs.mkdirSync("public/" + path);	
	

// Cambiamos el nombre y la carpeta de los archivos almacenados y lo guardamos en la BD
	for (var i = 0; i < files.length; i++) {
		var fileName = path + '/' + files[i].name;
		fs.rename(files[i].path, "public/" + fileName);
		
		//Creamos una nueva imagen y la rellenamos con los datos del form

		var picture = new Picture();
		picture.palace = palace._id;
		picture.url = fileName;
		if (comments != undefined)
			picture.comment = comments[i];
		picture.save(function (err) {
			if (err) {
				// Si ocurre algún error enviar el mensaje de error
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				// Enviar una representación JSON del picture 
//				res.json(picture);
			}
		});

		// Llenamos el array de pictures del palace
		palace.picture.push(picture);
	}
	
	// Intentar salvar el palace
	palace.save(function (err) {
		if (err) {
			// Si ocurre algún error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(palace);
		}
	});

};

// Crear un nuevo método controller que recupera una lista de palacios
exports.list = function (req, res) {
	// Usar el método model 'find' para obtener una lista de artículos
	Palace.find().sort('country').populate('comments picture').exec(function (err, palaces) {
		if (err) {
			// Si un error ocurre enviar un mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(palaces);
		}
	});
};

// Crear un nuevo método controller que devuelve un palacio existente
exports.read = function (req, res) {
	res.json(req.palace);
};

// Crear un nuevo método controller que actualiza un palacio existente
exports.update = function (req, res) {
	// Obtener el palacio usando el objeto 'request'
	var palace = req.palace;
	
	// Actualizar los campos palacio
	palace.name = req.body.name;
	palace.coord.lat = req.body.coord.lat;
	palace.coord.lng = req.body.coord.lng;
	palace.town = req.body.town;
	palace.country = req.body.country;
	palace.type = req.body.type;
	palace.rate = req.body.rate;
	palace.resena = req.body.resena;
//	if (req.body.comment) 
//		palace.comments.push(req.body.comment);
//	palace.picture = req.body.picture;
	
	
	// Intentar salvar el palacio actualizado
	palace.save(function (err) {
		if (err) {
			// si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del palacio
			res.json(palace);
		}
	});
};

// Crear un nuevo método controller que borre un palacio existente
exports.delete = function (req, res) {
	// Obtener el palacio usando el objeto 'request'
	var palace = req.palace;
	
	// Borramos los comentarios sobre el palacio y las fotografías
	for (var i = 0; i < palace.comments.length; i++) {
		Comment.findById(palace.comments[i], function (error, comment) {
			if (error) return res.status(500).send(error);
			// Configurar la propiedad 'author' del comentario
			comment.delete();
		});
	}
	palace.comments = [];
	
	for (var i = 0; i < palace.picture.length; i++) {
		if (fs.existsSync(palace.picture[i]).url)
			fs.unlink(palace.picture[i].url);
		var query = Picture.remove({ _id: palace.picture[i].id });
		query.exec();
	}
	palace.picture = [];

	// Usar el método model 'remove' para borrar el palacio
	palace.remove(function (err) {
		if (err) {
			// Si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del palacio 
			res.json(palace);
		}
	});
};

// Crear un nuevo controller middleware que recupera un único palacio existente
exports.palaceByID = function (req, res, next, id) {
	// Usar el método model 'findById' para encontrar un único palacio 
	Palace.findById(id).populate('comments picture').exec(function (err, palace) {
		if (err) return next(err);
		if (!palace) return next(new Error('Fallo al cargar el palacio ' + id));
		
		// Si un palacio es encontrado usar el objeto 'request' para pasarlo al siguietne middleware
		req.palace = palace;
		
		// Llamar al siguiente middleware
		next();
	});
};

// Crear un nuevo controller middleware que es usado para autorizar una operación palace 
exports.hasAuthorization = function (req, res, next) {
	// si el usuario actual no es el creador del artículo, enviar el mensaje de error apropiado
	if (!req.user.isAdmin) { // sustituido (req.palace.creador.id !== req.user.id) por (false)
		return res.status(403).send({
			message: 'Usuario no está autorizado'
		});
	}
	
	// Llamar al siguiente middleware
	next();
};
