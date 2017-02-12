
'use strict';

angular.module('carousel')
.controller('carousel', function ($scope) {
	$scope.setInterval = 4000;
	$scope.slides = [
		{
			title: 'Beautiful palaces in the world',
			image: '/carousel/images/mostbeautifulpalace.jpg',
			text: 'Look up the most beautiful palaces you know'
		},
		{
			title: 'Inside and outside',
			image: '/carousel/images/insidethepalace.jpg',
			text: 'You can see the most sumptouos halls and amazing gardens'
		},
		{
			title: 'From Thailand ...',
			image: '/carousel/images/Grand_Palace-Bangkok.jpg',
			text: 'Palaces throughout the world'
		},
		{
			title: '... To Spain',
			image: '/carousel/images/lagranja.jpg',
			text: 'All kind of palaces'
		}
	];
});


