// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'palaces'
angular.module('palaces')
.factory('Palaces', ['$resource', function ($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' palace
	return $resource('api/palaces/:palaceId', {
		palaceId: '@_id'
		}, {
			'get': { method: 'GET' },
			'query': { method: 'GET', isArray: true },
			'update': { method: 'PUT' },
			'save': { method: 'POST' },
			'remove': { method: 'DELETE' }
		});
}])

  .factory('factoryPalaces', ['Palaces', '$q', function (Palaces, $q) {
		var defered = $q.defer();
		var promise = defered.promise;
		
		Palaces.query(function (data) {
			defered.resolve(data);
		}, function (data, status, headers, config) {
			alert("Ha fallado la carga. Status: " + status);
			defered.reject(status);
		});
		return {
			getPalaces : function () {
				return promise;
			}
		};
	}])

  .factory('factoryOnePalace', ['Palaces', '$q', '$routeParams', 'palaceIdSrvc', function (Palaces, $q,$routeParams,palaceIdSrvc) {
		var defered = $q.defer();
		var promise = defered.promise;
		if (palaceIdSrvc.id) {
			Palaces.get({ palaceId : palaceIdSrvc.id }, 
			function (data) {
				defered.resolve(data);
			}, function (data, status, headers, config) {
				alert("Ha fallado la carga del palacio. Status: " + status);
				defered.reject(status);
			}
			);
		}
		return {
			getPalace : function () {
				return promise;
			}
		};
	}])


.service('modalWindow', function () {
	return { newComment : '' };
})


  .service('normalize', function () {
	this.textNormalized = function (texto) {
		if (texto != undefined) {
			texto = texto.replace(/[Ã¡Ã Ã¤Ã¢]/g, "a");
			texto = texto.replace(/[Ã©Ã¨Ã«Ãª]/g, "e");
			texto = texto.replace(/[Ã­Ã¬Ã¯Ã®]/g, "i");
			texto = texto.replace(/[Ã³Ã²Ã´Ã¶]/g, "o");
			texto = texto.replace(/[ÃºÃ¹Ã¼Ã¼]/g, "u");
			texto = texto.toUpperCase();
		}
		return texto;
	}
})

.service('setNewBoundsSrvc', ['palacesSrvc','NgMap',function (palacesSrvc, NgMap) {
	this.setNewBounds = function (map) {
		var bounds = new google.maps.LatLngBounds();;
			for (var i = 0; i < palacesSrvc.palaces.length; i++) {
				if (palacesSrvc.palaces[i].selected) {
					var p = palacesSrvc.palaces[i];
					var coord = new google.maps.LatLng(p.coord.lat, p.coord.lng);
					bounds.extend(coord);
					map.fitBounds(bounds);
				}
		}
	}
}])

  .service('indexSrvc', function () {
	return { name : '' };

})

  .service('palaceIdSrvc', function () {
	return { id : '' };

})

  .service('urlPicSrvc', function () {
	return { url : '' };

})


  .service('palacesSrvc', function () {
	return { palaces : null };
})

  .service('palacesShowedSrvc', function () {
	return { palaces : null };
})

  .service('mapBoundSrvc', function () {
	return { bounds : null };
})

  .service('viewSearchSrvc', function () {
	return { isViewPalaces: null };
})

  .service('listCountriesSelectedSrvc', function () {
	return { listCountries: null };
})

  .service('noPalacesForCountrySrvc', function () {
	return { listCountries: null };
});

