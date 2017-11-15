'use strict';
angular.module('openHelpApp')
  .controller('loginController', function($scope,$state) {
    $scope.input = {};
    $scope.login = function () {
      $state.go('dashboard.home');
    }
});
