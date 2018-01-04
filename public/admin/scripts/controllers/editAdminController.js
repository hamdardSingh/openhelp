'use strict';
angular.module('openHelpApp')
.controller('editAdminController',function($scope,$rootScope,$modalInstance,$state,$timeout,httpService,Upload,row,extra){
  $scope.oldRow = row;
  $scope.row = angular.copy($scope.oldRow);
  $scope.response = {};
  if(!$scope.row) $scope.row = {};
  var map = "";
  var latlng = "";
  var radius = null;
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.initMap = function () {
    if($scope.row.latlng){
      latlng = new google.maps.LatLng($scope.row.latlng.lat, $scope.row.latlng.lng);
    }else {
      latlng = new google.maps.LatLng(39.305, -76.617);
    }

    map = new google.maps.Map(document.getElementById('map'), {
      center: latlng,
      zoom: 8,
      scrollwheel: false,
    });

    var input = document.getElementById('managingArea');

    var autocomplete = new google.maps.places.Autocomplete(input,{types: ['geocode']});

    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });
    if(latlng!=""){
      marker.setPosition(latlng);
      marker.setVisible(true);
    }

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      latlng = place.geometry.location;
      $scope.row.latlng = {lat:latlng.lat(),lng:latlng.lng()};
  
      $scope.row.managingArea = place.formatted_address;
      if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindowContent.children['place-icon'].src = place.icon;
      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-address'].textContent = address;
      infowindow.open(map, marker);
    });
  }



  $scope.mapCircle = function () {

    if(radius !== null){
      radius.setMap(null);
    }
    radius = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: latlng,
            radius: ($scope.row.radius * 1000)
    });
  }
  $modalInstance.opened.then(function(){
    setTimeout(function () {
      $scope.initMap();
      if($scope.row.radius){
        $scope.mapCircle();
      }
    }, 1000);
  });

  $scope.ok = function () {

      if($scope.file){
        $scope.row.file = $scope.file;
      }
      Upload.upload({
           url: '/admin/api/v1/adminusers',
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


})
