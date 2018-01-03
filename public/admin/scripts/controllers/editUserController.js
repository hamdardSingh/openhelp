'use strict';
angular.module('openHelpApp')
.controller('editUserController',function($scope,$rootScope,$modalInstance,$state,$timeout,httpService,Upload,row,extra){
  $scope.oldRow = row;
  $scope.row = angular.copy($scope.oldRow);
  $scope.response = {};
  if(!$scope.row) $scope.row = {};

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.ok = function () {

      if($scope.file){
        $scope.row.file = $scope.file;
      }
      Upload.upload({
           url: '/admin/api/v1/users',
           data: $scope.row
       }).then(function (resp) {
          $scope.response = resp.data;
          if(resp.data.error==0){
            $state.reload();
          }
       }, function (resp) {
          $scope.response = {error:1,msg:resp.status};
       }, function (evt) {
           var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
           console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
       });
  }
  setTimeout(function () {
    $('img').on('error',function(){
    	$(this).attr('src','/images/thumb.png');
    	alert('ok');
    }); 
  }, 1000);



})
