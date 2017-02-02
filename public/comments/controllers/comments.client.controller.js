// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'comments'
angular.module('comments').controller('CommentsController', ['$scope', '$routeParams', '$location', 'Authentication', 'Comments', 'PalaceID',
	function ($scope, $routeParams, $location, Authentication, Comments, PalaceID) {
		// Exponer el service Authentication
		$scope.authentication = Authentication;
		
		// Crear un nuevo método controller para crear nuevos comments
		$scope.create = function () {
			// Usar los campos form para crear un nuevo objeto $resource comment
			var comment = new Comments({
				palace: PalaceID._id,
				customerRate: this.customerRate,
				titule: this.titule,
				text: this.text,
			});
			
			// Usar el método '$save' de comment para enviar una petición POST apropiada
			comment.$save(function (response) {
				// Si un comentario fue creado de modo correcto, redireccionar al usuario a la página del comentario 
				$location.path('comments/' + response._id);
			}, function (errorResponse) {
				// En otro caso, presentar al usuario el mensaje de error
				$scope.error = errorResponse.data.message;
			});
		};
		
		// Crear un nuevo método controller para recuperar una lista de comentarios
		$scope.find = function () {
			// Usar el método 'query' de comment para enviar una petición GET apropiada
			$scope.comments = Comments.query();
		};
		
		// Crear un nuevo método controller para recuperar un unico comentario
		$scope.findOne = function () {
			// Usar el método 'get' de comment para enviar una petición GET apropiada
			$scope.comment = Comments.get({
				commentId: $routeParams.commentId
			});
		};
		
		// Crear un nuevo método controller para actualizar un único comment
		$scope.update = function () {
			// Usar el método '$update' de comment para enviar una petición PUT apropiada
			$scope.comment.$update(function () {
				// Si un comment fue actualizado de modo correcto, redirigir el user a la página del comment 
				$location.path('comments/' + $scope.comment._id);
			}, function (errorResponse) {
				// En otro caso, presenta al user un mensaje de error
				$scope.error = errorResponse.data.message;
			});
		};
		
		// Crear un nuevo método controller para borrar un único comentario
		$scope.delete = function (comment) {
			// Si un comentario fue enviado al método, borrarlo
			if (comment) {
				// Usar el método '$remove' del comentario para borrar el comentario
				comment.$remove(function () {
					// Eliminar el comentario de la lista de comentarios
					for (var i in $scope.comments) {
						if ($scope.comments[i] === comment) {
							$scope.comments.splice(i, 1);
						}
					}
				});
			} else {
				// En otro caso, usar el método '$remove' de comment para borrar el comment
				$scope.comment.$remove(function () {
					$location.path('comments');
				});
			}
		};

	}
]);