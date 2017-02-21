
'use strict';

angular.module('carousel')
.controller('carouselController', function ($scope,Setup) {
	$scope.setInterval = 4000;
	
	$scope.find = function () {
		// Usar el método 'query' de setup para enviar una petición GET apropiada
		$scope.setup = Setup.query();
	};

});


