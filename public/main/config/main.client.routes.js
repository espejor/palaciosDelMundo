angular.module('main')
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: 'carousel/views/carousel.client.view.html'
    }).
    otherwise({
      redirectTo: '/'
    });
  }
]);