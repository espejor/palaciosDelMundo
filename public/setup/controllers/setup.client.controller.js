// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'setups'
angular.module('setup')
.controller('SetupController', ['$scope', '$routeParams', '$location', 'Authentication','Setup', 'Upload',
	function ($scope, $routeParams, $location, Authentication,Setup,Upload) {
		$scope.authentication = Authentication;
		
		$scope.setup = {};
		
		

		// --------------------Crear un nuevo método controller para actualizar un único setup
		// ---------------------------------------------------------------------------------------------------
		
		$scope.update = function () {
			if ($scope.files && $scope.files.length) {
				var picComments = [{}];
//				$scope.urlPic = $scope.files[0].path;
				
				for (var i=0;i < $scope.files.length;i++) {
					var comments = {};
					comments.title = $scope.files[i].title;
					comments.txt = $scope.files[i].txt;
					picComments.push(comments);
				}
			}
			Upload.upload({
				url: '/api/setup/' + $scope.setup[0]._id,
				method: 'PUT',
				data : {
					fields: {
						initInfo: $scope.setup[0].initInfo,
						photosCarousel: $scope.setup[0].photosCarousel,
						picComments: picComments	// Comentarios de las nuevas imágenes
					}, 
					files: $scope.files	//nuevas imágenes
				}
			})
				.progress(function (event) {
				var progressPercentage = parseInt(100.0 * event.loaded / event.total);
				console.log('progress: ' + progressPercentage + '% ');
			}).success(function (data, status, headers, config) {
				console.log('file uploaded. Response: ' + JSON.stringify(data));
				Setup.get({ setupId : data._id }, function (res) {
					for (var i=0;i<$scope.setup.length;i++) {
						if ($scope.setup[i]._id === $scope.setup[0]._id) {
							$scope.setup.splice(i, 1);
						}
					}
					$scope.setup.push(res);
				}, function (err) {
					console.log('Error al recuperar el setup');
				});
				
				$location.path('/');
			}).error(function (resp) {
				console.log('Error ' + resp.status);
			});
		};
		

		
		$scope.find = function () {
			// Usar el método 'query' de setup para enviar una petición GET apropiada
			$scope.setup = Setup.query();
		};

		
		$scope.deletePictureSelection = function () {
			$scope.files = [];
		};
		
		
		$scope.deletePicture = function (picture) {
			if ($scope.setup[0].photosCarousel.length > 1) {
				// Eliminar el palacio de la lista de palacios
				for (var i in $scope.setup[0].photosCarousel) {
					if ($scope.setup[0].photosCarousel[i]._id === picture._id) {
						$scope.setup[0].photosCarousel.splice(i, 1);
					}
				};
				$location.path('/setup');
			} else {
				$scope.errorPicturesInPalace = 'El carrusel debe tener al menos una fotografía. Imposible borrar la imagen';
				setTimeout(function () {
					$scope.errorPicturesInPalace = false;
				}, 5000);
			}
		};
	}
]);
