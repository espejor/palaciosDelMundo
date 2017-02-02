// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'palaces'
angular.module('palaces').factory('Palaces', ['$resource', function ($resource) {
		// Usar el service '$resource' para devolver un objeto '$resource' palace
		return $resource('api/palaces/:palaceId', {
			palaceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}]);