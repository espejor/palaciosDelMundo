// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'palaces'
angular.module('palaces').config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		when('/palaces', {
			templateUrl: 'palaces/views/list-palaces.client.view.html'
		}).
		when('/palaces/create', {
			templateUrl: 'palaces/views/create-palace.client.view.html'
		}).
		when('/palaces/upload', {
			templateUrl: 'palaces/views/upload-image.client.view.html'
		}).
		when('/palaces/:palaceId', {
			templateUrl: 'palaces/views/view-palace.client.view.html'
		}).
		when('/palaces/gallery/:palaceId', {
			templateUrl: 'palaces/views/gallery-palace.client.view.html'
		}).
		when('/palaces/:palaceId/edit', {
			templateUrl: 'palaces/views/edit-palace.client.view.html'
		});
	}
]);