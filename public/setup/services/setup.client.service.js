// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'palaces'
angular.module('setup').factory('Setup', ['$resource', function ($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' picture
	return $resource('api/setup/:setupId', {
			setupId: '@_id'
		},{
			'get': { method: 'GET' },
			'query': { method: 'GET', isArray: true },
			'update': { method: 'PUT' },
			'save': { method: 'POST' }
	});
}]);