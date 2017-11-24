'use strict';
angular.module('demo').config(['$stateProvider',
function ($stateProvider){
  $stateProvider
    .state('demo', {
        url : '/demo',
        templateUrl:'modules/demo/client/views/result.html',

    });
}
]);
