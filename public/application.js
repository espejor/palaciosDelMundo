var mainApplicationModuleName = 'palacesOfTheWorld';

var mainApplicationModule = angular.module(mainApplicationModuleName, [
	'ngResource', 
	'ngRoute', 
	'palaces', 
	'users', 
	'main', 
	'comments', 
	'ngFileUpload'
]);

mainApplicationModule.config(['$locationProvider',
	function ($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

angular.element(document).ready(function () {
	angular.bootstrap(document, [mainApplicationModuleName]);
});