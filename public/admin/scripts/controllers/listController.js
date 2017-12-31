'use strict';
angular.module('openHelpApp')
  .controller('listController', ['$scope','$state','httpService','$modal',function($scope,$state,httpService,$modal) {
    $scope.list = [];
    $scope.error = {};

    httpService.get($state.current.url).then(function(data){
      if((data.data && typeof(data.data.error) == 'undefined') || (typeof(data.data.error) != 'undefiend' && data.data.error == 0)){
        $scope.list = data.data
      }else{
        $scope.error = {type:'alert-warning',msg:'<i class="fa fa-warning"> No users'}
      }
    });

    $scope.open = function (id,ctrl,customCtrl) {

  		ctrl = (ctrl === 1) ? 'editListController' : 'addListController' ;
      if(typeof(customCtrl) != 'undefined'){
        ctrl = customCtrl;
      }
  		var extra = {};
  		var size = 'md';var backdrop = true;

      if ($state.current.url == '/adminusers') {
        size='lg';
      }

  		$modal.open({
  			animation: true,
  			templateUrl: '/admin/views/modals'+$state.current.url+'edit.html',
  			controller: ctrl,
  			size:size,
  			backdrop:backdrop,
  			resolve: {
  				row: function () {
  				  	return $scope.list[id];
  				},
  				extra: function () {
  					return extra;
  				}
  			}
  		});
  	}

    $scope.deleteRow = function(row){
   		httpService.deleteModal(row,$state.current.url);
   	}

}])
.controller('editListController',function($scope,$rootScope,$modalInstance,$state,httpService,row,extra){
  $scope.row = angular.copy(row);
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.ok = function () {
    httpService.post('/categories',$scope.row).then(function (resp) {
      $scope.response = resp.data;
      $sate.reload();
    });
  }
})

.controller('addListController',function($scope,$rootScope,$modalInstance,$state,httpService,row,extra){
  $scope.row = row;
  $scope.response = {};
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.ok = function () {
    httpService.post('/categories',$scope.row).then(function (resp) {
      $scope.response = resp.data;
      $sate.reload();
    });
  }
});
