'use strict';
angular.module('openHelpApp')
  .factory('httpService', ['$http',function($http) {
    var urlBase = '/api/v1/admin';
    var services = {};
    services.get = function(url,data){
      return $http.get(urlBase+url);
    }

    return services;
  }]);
