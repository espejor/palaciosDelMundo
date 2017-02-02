// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'Comments'
angular.module('comments').factory('Comments', ['$resource', function ($resource) {
		// Usar el service '$resource' para devolver un objeto '$resource' comment
		return $resource('api/comments/:commentId', {
			commentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}]);