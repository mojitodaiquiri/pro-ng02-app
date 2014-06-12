//angular.module('security.interceptor', ['security.retryQueue'])


var interc = angular.module('security.interceptor',['security.retryQueue']);

// This http interceptor listens for authentication failures
interc.factory('securityInterceptor', ['$injector', 'securityRetryQueue', function($injector, queue) {
  console.log("securityInterceptor 001");
  return function(promise) {
    // Intercept failed requests
    return promise.then(null, function(originalResponse) {
      if(originalResponse.status === 401) {
    	console.log("unauthorized >>"+JSON.stringify(originalResponse));
        // The request bounced because it was not authorized - add a new request to the retry queue
    	var reason =  'unauthorized-server';
        promise = queue.pushRetryFn(reason, function retryRequest() {
          // We must use $injector to get the $http service to prevent circular dependency
          return $injector.get('$http')(originalResponse.config);
        });
      }
      return promise;
    });
  };
}])

// We have to add the interceptor to the queue as a string because the interceptor depends upon service instances that are not available in the config block.
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.responseInterceptors.push('securityInterceptor');
}]);