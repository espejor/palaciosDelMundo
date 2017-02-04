
'use strict';

angular.module('main')
.controller('MainController', ['$scope', 'Authentication',
  function($scope, Authentication) {
    $scope.authentication = Authentication;
  }
])

