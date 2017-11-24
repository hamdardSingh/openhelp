'use strict';

angular.module('demo').controller('userController',['$scope' ,function($scope){

$scope.display = function(){
  console.log($scope.userName);

  var a = 12*3;
  console.log(a);
}
}
]);
