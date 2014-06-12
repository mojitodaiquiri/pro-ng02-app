'use strict';

/* Services */


angular.module('services', [])

.service('messageService', function($http){
	
	this.getMessageHello = function(callback){
		$http({
			url: 'http://flexdevcenter10.edg.grptop.net:7080/pro-ng02/rest/message/hello',
			method: "GET",
			params: {'_t' : new Date().getTime()}
		}).success(callback);
	};
	
})

.service('userService', function($http){
	
	this.getAll = function(queryString){
    	console.log("getAll queryString=["+queryString+"]");

		return $http({
			url: 'http://flexdevcenter10.edg.grptop.net:7080/pro-ng02/rest/users?'+queryString,
			method: "GET",
			params: {}
		});
	};
	
		
	this.getUser = function(queryString){
    	console.log("Sono nel service js getUserId UserId=["+queryString+"]");

		return $http({
			url: 'http://flexdevcenter10.edg.grptop.net:7080/pro-ng02/rest/users/user?'+queryString,
			method: "GET",
			params: {}
		});
	};
	
	
	
})


.service('orderService', function($http){
	
	this.getAll = function(queryString){
    	console.log("getAll queryString=["+queryString+"]");

		return $http({
			url: 'http://flexdevcenter10.edg.grptop.net:7080/pro-ng02/rest/orders?'+queryString,
			method: "GET",
			params: {}
		});
	};
	
})

;
