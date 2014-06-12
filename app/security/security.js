var secsec = angular.module('security.service',['security.retryQueue']);

secsec.factory('security', ['$http','$q','$location','$state','securityRetryQueue', function security($http,$q, $location,$state,queue) {
    	console.log("security 009");
    	  // Redirect to the given url (defaults to '/')
    	  function redirect(url) {
    	    url = url || '/';
    	    $location.path(url);
    	  }


    	  function privHasPermission(user,permission)
    	  {
      	    //console.log("privHasPermission ["+permission+"]");
	  	    if ( !!user)
	  	    {
	  	     if ( !!(user && user.admin))
	  	       return true;
	  	     else
	  	     {
	  	        for (index = 0; index < user.roles.length; ++index) {
      	    		  for (i2 = 0; i2 < user.roles[index].permissions.length; ++i2) {
  	    			    if ( user.roles[index].permissions[i2] == permission)
  	    			    	return true;
      	    		  }
  	    		  }
	  	          return false;
	  	    	}
	  	      }
	  	      else
	  	    	  return false;
    	  }
    	  
    	  // Register a handler for when an item is added to the retry queue
    	  queue.onItemAddedCallbacks.push(function(retryItem) {
    	    if ( queue.hasMore() ) {
    	      service.showLogin();
    	    }
    	  });

    	  // The public API of the service
    	  var service = {

    	    // Get the first reason for needing a login
    	    getLoginReason: function() {
    	      return queue.retryReason();
    	    },

    	    // Show the modal login dialog
    	    showLogin: function() {
    	    	$state.go('login', null,{reload:true});
    	    },

    	    // Attempt to authenticate a user by the given email and password
    	    login: function(username, password,remember) {
    	      service.currentUser=null;
    	      var request = $http.post('rest/security/login', {username: username, password: password, remember: remember});
    	      return request.then(function(response) {
    	          console.log("response ["+JSON.stringify(response)+"]");
      	        service.currentUser = response.data.user;
    	        service.currentMessage = response.data.cause;
    	        if ( service.isAuthenticated() ) {
    	        	queue.retryAll();
    	        }
    	        return service.isAuthenticated();
    	      });
    	    },

    	    // Give up trying to login and clear the retry queue
    	    cancelLogin: function() {
    	      redirect();
    	    },

    	    // Logout the current user and redirect
    	    logout: function(redirectTo) {
    	      $http.post('rest/security/logout').then(function() {
    	        service.currentUser = null;
    	        redirect(redirectTo);
    	      });
    	    },

    	    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    	    requestCurrentUser: function() {
    	      if ( service.isAuthenticated() ) {
    	        return $q.when(service.currentUser);
    	      } else {
    	        return $http.get('rest/security/current-user').then(function(response) {
    	          
    	          soUtente = true;	
    	          service.currentUser = response.data.user;
    	          
    	          if ( service.currentUser != null )
    	          {	  
    	        	  console.log(">>> user >>>"+service.currentUser.lastName);
    	        	  $state.go('home.dashboard', null);
    	          }
    	          else
    	        	  $state.go('login', null);
    	          return service.currentUser;
    	        });
    	      }
    	    },

    	    // Information about the current user
    	    currentMessage: null,

    	    // Information about the current user
    	    currentUser: null,

    	    // get the current message
    	    getCurrentMessage: function(){
    	      return service.currentMessage;
    	    },
    	    
    	    // Is the current user authenticated?
    	    isAuthenticated: function(){
    	      return !!service.currentUser;
    	    },
    	    
    	    // Is the current user an adminstrator?
    	    isAdmin: function() {
    	      return !!(service.currentUser && service.currentUser.admin);
    	    },
    	    
    	    // Has role 
    	    hasRole: function(role) {
    	      if ( service.isAuthenticated())
    	      {
    	    	  if ( service.isAdmin())
    	    		  return true;
    	    	  else
    	    	  {
    	    		  for (index = 0; index < service.currentUser.roles.length; ++index) {
    	    			    if ( service.currentUser.roles[index].name == role)
    	    			    	return true;
    	    		  }
    	    		  return false;
    	    	  }
    	      }
    	      else
    	    	  return false;
      	      //return !!(service.currentUser && (service.currentUser.admin || (service.currentUser.roles.indexOf(role) != -1) ));
    	    },
    	    
    	    // Has permission 
    	    hasPermission: function(permission) {
    	    	return privHasPermission(service.currentUser,permission);
    	    }
    	    
    	    
    	  };

    	  return service;
    }]);

