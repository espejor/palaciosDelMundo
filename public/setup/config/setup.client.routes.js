// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'palaces'
angular.module('setup').config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		when('/setup', {
			templateUrl: 'setup/views/setup.client.view.html'
		});
	}
]);