// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'palaces'
angular.module('palaces').factory('Pictures', ['$resource', function ($resource) {
		// Usar el service '$resource' para devolver un objeto '$resource' picture
		return $resource('api/picture/:pictureId', {
			pictureId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}]);