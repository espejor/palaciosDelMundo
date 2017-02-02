// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'comments'
angular.module('comments').config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		when('/comments', {
			templateUrl: 'comments/views/list-comments.client.view.html'
		}).
		when('/comments/create', {
			templateUrl: 'comments/views/create-comment.client.view.html'
		}).
		when('/comments/:commentId', {
			templateUrl: 'comments/views/view-comment.client.view.html'
		}).
		when('/comments/:commentId/edit', {
			templateUrl: 'comments/views/edit-comment.client.view.html'
		});
	}
]);