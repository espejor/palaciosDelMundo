// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'palaces'
angular.module('palaces')
.controller('PalacesController', ['$scope', '$routeParams', '$location', 'Authentication', 'Palaces', 'PalaceID', 
	'Pictures', 'Upload',
	'indexSrvc',
	'mapBoundSrvc', 'palacesSrvc', 'normalize', 'noPalacesForCountrySrvc', 
	'viewSearchSrvc', 'listCountriesSelectedSrvc', 'factoryPalaces', 'setNewBoundsSrvc', 'palacesShowedSrvc', '$modal' , 
	'NgMap','$route', 'factoryOnePalace', 'palaceIdSrvc',
	function ($scope, $routeParams, $location, Authentication, Palaces, PalaceID, Pictures, Upload,
		indexSrvc, mapBoundSrvc,	
		palacesSrvc, normalize, noPalacesForCountrySrvc, viewSearchSrvc, listCountriesSelectedSrvc, factoryPalaces,
		 setNewBoundsSrvc, palacesShowedSrvc, $modal, NgMap, $route, factoryOnePalace,palaceIdSrvc) {
		
		$scope.palaces = [];
		$scope.API_KEY = 'AIzaSyDiuNu0M0LLEb8fKRUvytjspLlsP5AEoMw';

		
		//promesa 
		$scope.load = function () {
			var promesa = factoryPalaces.getPalaces();

			promesa.then(function (listPalaces) {
				$scope.palaces = listPalaces;
				for (var i = 0; i < $scope.palaces.lendth; i++) $scope.palaces[i].selected = true;
				$scope.fillListCountries();
				$scope.fillListTowns();
				palacesSrvc.palaces = $scope.palaces;
				listCountriesSelectedSrvc.listCountries = $scope.listCountriesSelected;

			}, function (error) {
				console.log("Error de carga de palacios");
			});
		};
		
		$scope.load();
		
		$scope.loadOne = function (id) {
			palaceIdSrvc.id = id;
			var promesa = factoryOnePalace.getPalace();
			
			promesa.then(function (p) {
				p.selected = true;
				$scope.palaces.push(p);
				$scope.fillListCountries();
				$scope.fillListTowns();
				palacesSrvc.palaces = $scope.palaces;
				listCountriesSelectedSrvc.listCountries = $scope.listCountriesSelected;

			}, function (error) {
				console.log("Error de carga del palacio de ID: " + id );
			});
		};

		
		// -------------Exponer el service Authentication
		$scope.authentication = Authentication;
		
		
		
		// --------------Inicialización de parámetros de las valoraciones
		$scope.listRate = ['5', '4', '3', '2', '1', '0'];
		$scope.rate = 0;
		$scope.max = 5;
		$scope.listRatesSelected = [false, false, false, false, false, false];
		$scope.isReadonly = true;
		
		//$scope.palaces = $scope.find();
		$scope.myFilter = $scope.address;
		$scope.rateFilter = null;
		$scope.listCountries = [[], [], []];
		$scope.listPalacesForCountry = [];
		$scope.listCountriesToSelect = [];
		$scope.listCountriesSelected = [];
		$scope.listTowns = [];
		//$scope.bounds = mapBoundSrvc.bounds;
		$scope.listPalacesSelected = [];
		
		// ------------------Crear un nuevo método controller para crear nuevos palaces
		// ---------------------------------------------------------------------------------------------------
		$scope.create = function () {
			
			if ($scope.files && $scope.files.length) {
				var picComments = [];
				$scope.urlPic = $scope.files[0].path;
				
				for (var i in $scope.files)
					picComments[i] = $scope.files[i].comment;
				Upload.upload({
					url: '/api/palaces', 
					data : {
						fields: {
							name: $scope.name,
							coord : { lat: $scope.lat, lng: $scope.lng },
							town: $scope.town,
							country: $scope.country,
							type: 'P',
							rate: 0,
							resena: $scope.resena,
							comments: picComments,
							web: $scope.web,
							phone: $scope.phone,
							email: $scope.email,
							address: $scope.address
						}, 
						files: $scope.files
					}
				})
				.progress(function (event) {
					var progressPercentage = parseInt(100.0 * event.loaded / event.total);
					console.log('progress: ' + progressPercentage + '% ');
				}).success(function (data, status, headers, config) {

					console.log('file uploaded. Response: ' + JSON.stringify(data));
					Palaces.get({ palaceId : data._id }, function (res) {
						$scope.palaces.push(res);
					}, function (err) {
						console.log('Error al recuperar el palacio');
					});

					$location.path('/palaces/');
				});
			} else {
				$scope.error = 'Un palacio debe tener al menos una fotografía';
			}
		};

		
		// --------------------Crear un nuevo método controller para recuperar una lista de palacios
		// ---------------------------------------------------------------------------------------------------
		
		$scope.find = function () {
			// Usar el método 'query' de palace para enviar una petición GET apropiada
			$scope.palaces = Palaces.query();
		};
		
		// --------------------Crear un nuevo método controller para recuperar un unico palacio
		// ---------------------------------------------------------------------------------------------------
		
		$scope.findOne = function () {
			// Usar el método 'get' de palace para enviar una petición GET apropiada
			$scope.palace = Palaces.get({
				palaceId: $routeParams.palaceId
			});
		};
		
		// --------------------Crear un nuevo método controller para actualizar un único palace
		// ---------------------------------------------------------------------------------------------------
		
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
		
		// ---------------------Crear un nuevo método controller para borrar un único palacio
		// ---------------------------------------------------------------------------------------------------
		
		$scope.delete = function (palace) {
			// Si un palacio fue enviado al método, borrarlo
			if (palace) {
				// Usar el método '$remove' del palacio para borrar el palacio
				palace.$remove(function () {
					// Eliminar el palacio de la lista de palacios
					for (var i in $scope.palaces) {
						if ($scope.palaces[i] === palace) {
							$scope.palaces.splice(i, 1);
						}
					}
				});
			} else {
				// En otro caso, usar el método '$remove' de palace para borrar el palace
				$scope.palace.$remove(function () {
					$location.path('/palaces');
				});
			}
		};
		
		// ---------------------------------------------------------------------------------------------------
		// ---------------------------------------------------------------------------------------------------
		// ---------------------------------------------------------------------------------------------------
		
		
		$scope.newComment = function (palace_id) {
			PalaceID._id = palace_id;
//			$location.path('comments/create');
		};
		
		
	

		
		$scope.deletePictureSelection = function () {
			$scope.files = [];
		};
		
		
		$scope.$watch('address', function (newValue, oldValue) {
			if (newValue !== oldValue)
				if ($scope.map) {
					setNewBoundsSrvc.setNewBounds($scope.map);
					if ($scope.map.getZoom() > 17)
						// demasiado zoom
						$scope.map.setZoom(17);
				};
		});
		
		//var otroMap = $scope.map.getCenter();
		
		$scope.fillPalacesForCountries = function () {
			for (var i = 0; i < $scope.palaces.length; i++) {

			}
		};

		//$scope.$watch('sc', function (newValue, oldValue) {
		//	if (newValue.palaces != oldValue.palaces)
		//		$scope.fillListCountries();
		//}, 
		//true);
		
		//$scope.$watch('$scope.listCountriesSelected', function (newValue, oldValue) {
		//	listCountriesSelectedSrvc.listCountries = $scope.listCountriesSelected;
		//}, 
		//true);
		
		// Llenar un array de objetos con los palacios por paises ---------------------------------------------------------
		
		$scope.fillListCountries = function () {
			
			for (var i = 0; i < $scope.palaces.length ; i++) {
				if ($scope.listCountries[0].indexOf($scope.palaces[i].country) == -1) { // Es un nuevo pais
					$scope.listCountries[0].push($scope.palaces[i].country);
					$scope.listCountries[1].push(1);
					$scope.listCountries[2].push($scope.palaces[i].picture[0].url);
				} else {
					$scope.listCountries[1][$scope.listCountries[0].indexOf($scope.palaces[i].country)]++;
				}
			}
			$scope.listCountriesToSelect = $scope.listCountries[0].slice();
			$scope.listCountriesToSelect.sort();
			for (var i = 0; i < $scope.listCountries[0].length; i++) {
				var country = { country: $scope.listCountries[0][i], totalPalaces: $scope.listCountries[1][i], picture: $scope.listCountries[2][i] };
				$scope.listPalacesForCountry.push(country);
			}
			noPalacesForCountrySrvc.listPalaces = $scope.listCountries;
		}
				
		// Llenar una array con las ciudades que tienen palacios  ---------------------------------------------------
		
		$scope.fillListTowns = function () {
			var i = 0;
			for (i = 0; i < $scope.palaces.length ; i++) {
				if ($scope.listTowns.indexOf($scope.palaces[i].town) == -1) {
					$scope.listTowns.push($scope.palaces[i].town);
				}
			}
			$scope.listTowns.sort();
		}
		
		
		$scope.goToPalace = function (event, palace) {
			indexSrvc.name = palace.name;
			var url = '#!/palaces/' + palace._id;
			location.href = url;
		}
		
		$scope.setIndex = function (name) {
			indexSrvc.name = name;
		};
		
		$scope.selectCountry = function (comboPalace) {
			$scope.listCountriesSelected = [];
			$scope.listCountriesSelected.push(comboPalace);
    //listCountriesSelectedSrvc.listCountries = $scope.listCountriesSelected;
		};
		
		$scope.filtrar = function (value) {
			$scope.palacesShowed = [];
			var response = $scope.customerFilter(value);
			if ($scope.map)			
				setNewBoundsSrvc.setNewBounds($scope.map);
			return response;
		}
		
		
		if (viewSearchSrvc.isViewPalaces == null) {
			$scope.verPorPalacios = false;
		} else {
			$scope.verPorPalacios = viewSearchSrvc.isViewPalaces;
		}
		var palacesShowed = palacesShowedSrvc.palaces;
		var boundsOfMap = null;
		
		
		$scope.cambiaVista = function (comboPalace) {
			$scope.verPorPalacios = true;
			viewSearchSrvc.isViewPalaces = true;
		}
		
		
		NgMap.getMap().then(function (map) {
			$scope.map = map;
			//    if (palacesShowed == null){    // primera vez que se entra en la pÃ¡gina de bÃºsqueda
			//$scope.verPorPalacios = false;
			$scope.map.setCenter({ lat: 0, lng: 0 });
			$scope.map.zoom = 0;
			//$scope.createMarkers();
			$scope.calculateNewBounds();
			//  }
//			.myMap = $scope.map;
		});
		
		
		$scope.showPalace = function (event, p) {
			$scope.selectedPalace = p;
			$scope.map.showInfoWindow('myInfoWindow', this);
		};
		
		$scope.hideInfo = function (event) {
			$scope.map.hideInfoWindow('myInfoWindow');
		};
		
		$scope.setNewBounds = function () {
			var bounds = new google.maps.LatLngBounds();
			for (var i = 0; i < palacesShowedSrvc.palaces.length; i++) {
				var p = palacesShowedSrvc.palaces[i];
				var coord = new google.maps.LatLng(p.coord.lat, p.coord.lng);
				bounds.extend(coord);
				$scope.map.fitBounds(bounds);
			}
		};
		
		$scope.calculateNewBounds = function () {
			////var palaces = $scope.find();
			//var palaces = palacesSrvc.palaces;
			//var matchAddress;
			//if (palaces.length != 0) {
			//	//palacesSrvc.palaces = palaces;
			//	var listCountriesSelected = listCountriesSelectedSrvc.listCountries;
			//	//--------- Filtro de palacios a ver
			//	palacesShowed = $filter('filter')(palaces,
			//		function (val) {
			//			if ($scope.address == undefined) {
			//				matchAddress = true;
			//			} else {
			//				matchAddress = normalize.textNormalized(val.name).includes(normalize.textNormalized($scope.address)) ||
			//			   normalize.textNormalized(val.town).includes(normalize.textNormalized($scope.address)) ||
			//			   normalize.textNormalized(val.country).includes(normalize.textNormalized($scope.address));
			//			}
			//			var matchCountry = true;
			//			if (listCountriesSelected.length != 0) {
			//				matchCountry = listCountriesSelected.includes(val.country);
			//			}
					
			//			return (matchCountry && matchAddress);
			//		}
			//	);
			//	palacesShowedSrvc.palaces = palacesShowed;
			//}
			//$scope.setNewBounds();
			//if ($scope.map.getZoom() > 17)  // demasiado zoom
			//	$scope.map.setZoom(17);
		};
		
		//$scope.addressChanged = function () {
		//	$scope.address = $scope.address;
		//	$scope.calculateNewBounds();
		//	$scope.verPorPalacios = true;
		//}
		
		$scope.countryChanged = function () {
			//$scope.address = $scope.address;
			//  listCountriesSelectedSrvc.listCountries = $scope.listCountriesSelected;
			$scope.calculateNewBounds();
			$scope.verPorPalacios = true;
		}
		
		$scope.getNewBounds = function () {
			boundsOfMap = $scope.map.getBounds();
		}
		
		$scope.onBoundsChanged = function () {
			//NgMap.getMap().then(function (evtMap) {
			//	$scope.map = evtMap;
			//	$scope.getNewBounds();
			//	mapBoundSrvc.bounds = boundsOfMap;
			//	mapSrvc.myMap = $scope.map;
			//})
		}
		
		$scope.customerFilter = function (value) {
			if (!$scope.map)
				return true;
			var txtToLookUp = $scope.address;
			var listRatesSelectedIsNull = $scope.listRatesSelected.indexOf(true) == -1;
			//    var rateFilterIsNull = $scope.rateFilter == null;
			var emptyListCountriesSelected = ($scope.listCountriesSelected == null) || ($scope.listCountriesSelected.length == 0);
			var isBoundNull = mapBoundSrvc.bounds == null;
			
			var countryIsOk = false;
			var rateIsOk = false;
			var txtIsOk = false;
			var mapIsOk = false;
			//if (value._id == palacesSrvc.palaces[0]._id) //Es el primer elemento de la serie

			
			if (isBoundNull) {
				mapIsOk = true;
			} else {
				mapIsOk = mapBoundSrvc.bounds.contains(new google.maps.LatLng(value.coord.lat, value.coord.lng));
			}
			
			if (!txtToLookUp) {
				txtIsOk = true;
			} else {
				txtIsOk =
				normalize.textNormalized(value.name).includes(normalize.textNormalized(txtToLookUp)) ||
				normalize.textNormalized(value.town).includes(normalize.textNormalized(txtToLookUp)) ||
				normalize.textNormalized(value.country).includes(normalize.textNormalized(txtToLookUp));
			}
			
			if (listRatesSelectedIsNull) {
				rateIsOk = true;
			} else {
				rateIsOk = $scope.listRatesSelected[$scope.max - value.rate];
			}
			
			if (emptyListCountriesSelected) {
				countryIsOk = true;
			} else {
				countryIsOk = $scope.listCountriesSelected.indexOf(value.country) != -1;
			}
			
			if (rateIsOk && countryIsOk && txtIsOk) {
				if (value)
					value.selected = true;
//				palacesShowedSrvc.palaces =$scope.palacesShowed;
				return true;
			} else {
				value.selected = false;
				return false;
			}

		}
	}
]);
