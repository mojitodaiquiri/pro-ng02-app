
elsagApp.controller('LoginController', ['$scope','$state', 'localizedMessages', 'security',function ($scope,$state,localizedMessages,security) {

	console.log("LoginController::costruttore 002");
	
	$scope.delay = 0;
	$scope.minDuration = 0;
	$scope.message = 'Attendere prego ...';
	$scope.backdrop = true;
	$scope.promise = null;
	
	// The model for this form
	$scope.user = {};

	// Any error message from failing to login
	$scope.authError = null;

	// The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
	// We could do something diffent for each reason here but to keep it simple...
	$scope.authReason = null;
	
	$scope.remember  = true;
	if ( security.getLoginReason() ) {
	    $scope.authReason = ( security.isAuthenticated() ) ?
	      localizedMessages.get('login.reason.notAuthorized') :
	      localizedMessages.get('login.reason.notAuthenticated');
	}
	
	// Metodi
	
	// Attempt to authenticate the user specified in the form's model
	  $scope.login = function() {
	    // Clear any previous security errors
	    $scope.authError = null;

	    // Try to login
	    $scope.promise = security.login($scope.user.username, $scope.user.password, $scope.remember ); 
	    $scope.promise.then(function(loggedIn) {
	      if ( !loggedIn ) {
	        // If we get here then the login failed due to bad credentials
	        //$scope.authError = localizedMessages.get('login.error.invalidCredentials');
	    	 
	    	$scope.authError = security.getCurrentMessage(); 
	      }
	      else
	      {
	    	$state.transitionTo('home.dashboard', null);
	      }
	    }, function(x) {
	      // If we get here then there was a problem with the login request to the server
	      $scope.authError = localizedMessages.get('login.error.serverError', { exception: x });
	    });
	  };
	  
	  
	  $scope.cancelLogin = function() {
		    //security.cancelLogin();
	  };
	  
	  
//	$scope.login = function() 
//	{ 
//		console.log("username ["+$scope.user.username+"] password ["+$scope.user.password +"] remember ["+$scope.remember +"]");
//		// Per ora salto diretto dentro
//		$state.transitionTo('home.dashboard', null);
//	};
	
	
	$scope.clearForm = function() {
	    $scope.user = {};
	};
	
	
}]);











