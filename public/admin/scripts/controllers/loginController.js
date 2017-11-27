'use strict';
angular.module('openHelpApp')
  .controller('loginController', ['$scope','$state','$http',function($scope,$state,$http) {
    $scope.input = {};
    $scope.usererror = false;
    $scope.passerror = false;
    $scope.login = function () {
      $scope.usererror = false;
      $scope.passerror = false;
      $http.post('/admin/api/v1/login',$scope.input).then(function (data) {
        if(data.data && data.data.error == 1){
          $scope.usererror = true;
          $scope.passerror = true;
        }else{
          $state.go('dashboard.home');
        }
      })

    }
}]);
