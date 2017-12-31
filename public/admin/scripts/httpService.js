'use strict';
angular.module('openHelpApp')
  .factory('httpService', ['$http','$modal',function($http,$modal) {
    var urlBase = '/admin/api/v1';
    var services = {};
    services.get = function(url,data){
      return $http.get(urlBase+url);
    }
    services.post = function(url,data){
      return $http.post(urlBase+url,data);
    }

    services.httpDelete = function(type,id){
    		return $http.delete(urlBase+type+'/'+id,{
    			headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
    			responseType: 'json',
    			cache: false
    		});
    }

    services.deleteModal = function(row,type){
  		return $modal.open({
  			animation: true,
  			templateUrl: '/admin/views/modals/delete.html',
  			controller: 'deleteController',
  			resolve: {
  				row: function () {
  				  	return row;
  				},
  				type: function () {
  					return type;
  				}
  			}
  		});
	}

    return services;
  }])
  .controller('deleteController', function($scope,$modalInstance,$state,row,type,httpService) {
	$scope.row = row;
	$scope.response = {};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.ok = function (){
		$scope.response = {};
		httpService.httpDelete(type,$scope.row._id).then(function(data){
			$scope.response = data.data;
			if(data.data !== null && typeof(data.data.error) !== "undefined"){
				if(data.data.error == 0){
					delete $scope.row._id;
				}
			}
		},function(data){
			if(data.data !== null ){
				$scope.response = {"error":1,"msg":data.data.error+" ("+data.status+", "+data.statusText+")"};
			}else{
				$scope.response = {"error":1,"msg":"("+data.status+", "+data.statusText+")"};
			}
		});
	}
});
