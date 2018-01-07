'use strict';
angular.module('openHelpApp')
.controller('editCaseController',function($scope,$rootScope,$modalInstance,$state,$timeout,httpService,$http,Upload,row,extra){
  $scope.oldRow = row;
  $scope.row = angular.copy($scope.oldRow);
  $scope.response = {};
  var Addressautocomplete;
  if(!$scope.row) $scope.row = {};
  if(!$scope.row.address) $scope.row.address = {};
  $scope.categories = [];
  $http.get('/api/v1/categories').then(function (data) {
    $scope.categories = data.data;
  })
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  $scope.componentForm = {street_number: 'short_name',route: 'long_name',locality: 'long_name',administrative_area_level_1: 'long_name',country: 'long_name',postal_code: 'short_name'};


  $scope.ok = function () {

      if($scope.file){
        $scope.row.file = $scope.file;
      }
      Upload.upload({
           url: '/admin/api/v1/cases',
           data: $scope.row
       }).then(function (resp) {
          $scope.response = resp.data;
          if(resp.data.error==0){
            $state.reload();
          }
       }, function (resp) {
          $scope.response = {error:1,msg:resp.status};
       }, function (evt) {
          
       });
  }

  $scope.addAutocomplete = function () {
    Addressautocomplete = new google.maps.places.Autocomplete((document.getElementById('address')),{types: ['geocode']});
    Addressautocomplete.addListener('place_changed', function () {
      var place = Addressautocomplete.getPlace();
      var latlng = place.geometry.location;
      $scope.row.latlng = {lat:latlng.lat(),lng:latlng.lng()};
      for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if ($scope.componentForm[addressType]) {
              var val = place.address_components[i][$scope.componentForm[addressType]];
              $scope.row.address[addressType]=val;
          }
      }

      $scope.$apply();
    });
  }

  $modalInstance.opened.then(function(){
    setTimeout(function () {
      $scope.addAutocomplete();
    }, 1000);
  });

  $scope.getAdmin = function($text,url){
    return httpService.get(url).then(function (data) {
        return data.data;
    })
  }

  $scope.selectAdmin = function($item, $model, $label) {
    $scope.row.adminId = $item;
  }

  $scope.selectUser = function($item, $model, $label) {
    $scope.row.userId = $item;
  }


})
