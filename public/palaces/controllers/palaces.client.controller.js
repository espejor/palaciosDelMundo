// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'palaces'
angular.module('palaces').controller('PalacesController', ['$scope', '$routeParams', '$location', 'Authentication', 'Palaces', 'PalaceID', 'Pictures', 'Upload',
	function ($scope, $routeParams, $location, Authentication, Palaces, PalaceID,Pictures,Upload) {
		// Exponer el service Authentication
		$scope.authentication = Authentication;
		
		// Crear un nuevo método controller para crear nuevos palaces
		$scope.create = function () {
			if ($scope.files && $scope.files.length) {
				Upload.upload({
					url: '/api/palaces', 
					data : {
						fields: {
							name: this.name,
							coord : { lat: this.lat, lon: this.lon },
							town: this.town,
							country: this.country,
							type: 'P',
							rate: 0,
							resena: this.resena
						}, 
						files: $scope.files
					}
				})
				.progress(function (event) {
					var progressPercentage = parseInt(100.0 * event.loaded / event.total);
					console.log('progress: ' + progressPercentage + '% ');
				}).success(function (data, status, headers, config) {
					console.log('file uploaded. Response: ' + JSON.stringify(data));
					$location.path('palaces/' + data._id);
				});
			} else {
				$scope.error = 'Un palacio debe tener al menos una fotografía';
			}
		};
		
		// Crear un nuevo método controller para recuperar una lista de artículos
		$scope.find = function () {
			// Usar el método 'query' de palace para enviar una petición GET apropiada
			$scope.palaces = Palaces.query();
		};
		
		// Crear un nuevo método controller para recuperar un unico artículo
		$scope.findOne = function () {
			// Usar el método 'get' de palace para enviar una petición GET apropiada
			$scope.palace = Palaces.get({
				palaceId: $routeParams.palaceId
			});
		};
		
		// Crear un nuevo método controller para actualizar un único palace
		$scope.update = function () {
			// Usar el método '$update' de palace para enviar una petición PUT apropiada
			$scope.palace.$update(function () {
				// Si un palace fue actualizado de modo correcto, redirigir el user a la página del palace 
				$location.path('palaces/' + $scope.palace._id);
			}, function (errorResponse) {
				// En otro caso, presenta al user un mensaje de error
				$scope.error = errorResponse.data.message;
			});
		};
		
		// Crear un nuevo método controller para borrar un único artículo
		$scope.delete = function (palace) {
			// Si un artículo fue enviado al método, borrarlo
			if (palace) {
				// Usar el método '$remove' del artículo para borrar el artículo
				palace.$remove(function () {
					// Eliminar el artículo de la lista de artículos
					for (var i in $scope.palaces) {
						if ($scope.palaces[i] === palace) {
							$scope.palaces.splice(i, 1);
						}
					}
				});
			} else {
				// En otro caso, usar el método '$remove' de palace para borrar el palace
				$scope.palace.$remove(function () {
					$location.path('palaces');
				});
			}
		};

		$scope.newComment = function (palace_id) {
			PalaceID._id = palace_id;
//			$location.path('comments/create');
		}

	}
]);