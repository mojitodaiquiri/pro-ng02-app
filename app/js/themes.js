angular.module('themes.module',['ngCookies'])
.factory('themes', ['$cookies','DEFAULT_THEME', function ($cookies,DEFAULT_THEME) {
		console.log("themes 001");
			// Gestisce i temi
    	
		 function switchTheme(theme)
		 {
			 if (theme.substring(0,6)=='custom')
				 $('#bs-css').attr('href','css/theme-'+theme+'.css');
			 else
				 $('#bs-css').attr('href','css/bootstrap-'+theme+'.css');
		 }

    	  // The public API of the service
    	  var service = {

    		currentTheme:null,	  

    		// ritorna il tema corrente
    		getCurrentTheme:function() {
    	    	return currentTheme;
    	    },
    	    
    		// ritorna il tema corrente
    	    changeTheme:function(theme) {
    	    	currentTheme = theme;
    	    	$cookies.current_theme = currentTheme;
    	    	switchTheme(currentTheme);
    	    },
    	    
    	    // Inizializzazione
    	    initialize: function() {
    	    	currentTheme = $cookies.current_theme==null ? DEFAULT_THEME : $cookies.current_theme;
    	    	switchTheme(currentTheme);
    	    }

    	  };
    	  console.log("["+JSON.stringify(service)+"]");
    	  return service;
    }]);

