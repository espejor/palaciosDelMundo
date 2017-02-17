var mainApplicationModuleName = 'palacesOfTheWorld';

var mainApplicationModule = angular.module(mainApplicationModuleName, [
	'ngResource', 
	'ngRoute', 
	'palaces', 
	'users', 
	'main', 
	'carousel',
	'setup',
	'comments', 
	'ui.bootstrap',
	'angularModalService',
	'ngMap',
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