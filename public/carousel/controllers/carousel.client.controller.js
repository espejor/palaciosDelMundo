
'use strict';

angular.module('carousel')
.controller('carouselController', function ($scope,Setup) {
	$scope.setInterval = 4000;
	
	$scope.find = function () {
		// Usar el m�todo 'query' de setup para enviar una petici�n GET apropiada
		$scope.setup = Setup.query();
	};

});


