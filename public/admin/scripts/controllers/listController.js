'use strict';
angular.module('openHelpApp')
  .controller('listController', ['$scope','$state','httpService',function($scope,$state,httpService) {
    $scope.list = [];
    $scope.error = {};

    httpService.get('/users').then(function(data){
      if((data.data && typeof(data.data.error) == 'undefined') || (typeof(data.data.error) != 'undefiend' && data.data.error == 0)){
        $scope.list = data.data
      }else{
        $scope.error = {type:'alert-warning',msg:'<i class="fa fa-warning"> No users'}
      }
    })

}]);
