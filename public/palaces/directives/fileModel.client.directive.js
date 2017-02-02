// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'Comments'
angular.module('palaces')

.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;
			
			element.bind('change', function () {
				scope.$apply(function () {
					modelSetter(scope, element[0].files);
				});
			});
		}
	};
}])