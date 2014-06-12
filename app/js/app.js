/* Application */
// app.js

var soUtente=false;

var defaultRout = function(){
		return "/sesapp/login";
};


window.elsagApp = angular.module('elsagApp', ['ui.router','security','ngCookies','themes.module','services','ngTable','ngAnimate','cgBusy', 'ngPDFViewer']);

// un po' di global
elsagApp.constant('DEFAULT_THEME','cerulean');


//TODO: move those messages to a separate module
elsagApp.constant('I18N.MESSAGES', {
  'errors.route.changeError':'Route change error',
  'crud.user.save.success':"A user with id '{{id}}' was saved successfully.",
  'crud.user.remove.success':"A user with id '{{id}}' was removed successfully.",
  'crud.user.remove.error':"Something went wrong when removing user with id '{{id}}'.",
  'crud.user.save.error':"Something went wrong when saving a user...",
  'crud.project.save.success':"A project with id '{{id}}' was saved successfully.",
  'crud.project.remove.success':"A project with id '{{id}}' was removed successfully.",
  'crud.project.save.error':"Something went wrong when saving a project...",
  'login.reason.notAuthorized':"You do not have the necessary access permissions. Do you want to login as someone else?",
  'login.reason.notAuthenticated':"You must be logged in to access this part of the application.",
  'login.error.invalidCredentials': "Login failed. Please check your credentials and try again.",
  'login.error.serverError': "There was a problem with authenticating: {{exception}}."
});



elsagApp.config(['$stateProvider','$urlRouterProvider','$locationProvider',function( $stateProvider, $urlRouterProvider,$locationProvider) {

	
	$locationProvider.html5Mode(true).hashPrefix('!');
	//$urlRouterProvider.otherwise('/login');
	$urlRouterProvider.otherwise(defaultRout);
    console.log(">>> config >>>>>>>>>>>>>SONO QUI []");
    
    $stateProvider

    .state('login', {
        url: '/sesapp/login',
        templateUrl: 'app/partial/login.html',
        controller: 'LoginController'
        	
    })

    
    .state('wait', {
        url: '/sesapp/wait',
        templateUrl: 'app/partial/wait.html'
        	
    })

    
    
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
        	abstract: true,
            url: '/sesapp/home',
        	views: {
                '': { templateUrl: 'app/partial/home.html' },
                'myHeader@home': { 
                    templateUrl: 'app/partial/home.header.html',
                    controller: 'HeaderController'
                },
                'myMenu@home': { 
                    templateUrl: 'app/partial/home.menu.html',
                    controller: 'MenuController'
                },
                'myFooter@home': { 
                    templateUrl: 'app/partial/home.footer.html'
                    //controller: 'scotchController'
                }
            }             	
            	
        })

        
        .state('home.dashboard', {
            url: '/dashboard',
        	views: {
                'myContent@home': { 
                    templateUrl: 'app/partial/home.content.dashboard.html',
                    controller: 'DashboardController'
                }
            }             	
            	
        })

        .state('home.ui-features', {
            url: '/ui-features',
        	views: {
                'myContent@home': { 
                    templateUrl: 'app/partial/home.content.ui-features.html'
                    //controller: 'scotchController'
                }
            }             	
            	
        })


        .state('home.ses-tables', {
            url: '/ses-tables',
        	views: {
                'myContent@home': { 
                    templateUrl: 'app/partial/home.content.ses-tables.html',
                    controller: 'SesTablesController'
                }
            }             	
            	
        })

        .state('home.orders', {
            url: '/orders',
        	views: {
                'myContent@home': { 
                    templateUrl: 'app/partial/home.content.orders.html',
                    controller: 'OrdersController'
                }
            }             	
            	
        })

        .state('home.ses-tabDetail', {
            url: '/ses-tablesDetail/:userId',
        	views: {
                'myContent@home': { 
                    templateUrl: 'app/partial/home.content.ses-tablesDetail.html',
                    controller: 'SesTabDetailController'
                }
            }             	
            	
        })



        .state('home.pdfview', {
            url: '/pdfview',
        	views: {
                'myContent@home': { 
                    templateUrl: 'app/partial/home.content.pdfview.html',
                    controller: 'PdfviewController'
                }
            }             	
            	
        })

        .state('home.pdfview2', {
            url: '/pdfview2',
        	views: {
                'myContent@home': { 
                    templateUrl: 'app/partial/home.content.pdfview2.html',
                    controller: 'PdfviewController2'
                }
            }             	
            	
        })

        .state('home.pdfview3', {
            url: '/pdfview3',
        	views: {
                'myContent@home': { 
                    templateUrl: 'app/partial/home.content.pdfview3.html',
                    controller: 'PdfviewController3'
                }
            }             	
            	
        })

        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            // we'll get to this in a bit       
        });
}]);



elsagApp.run(['themes','security', function(themes,security) {
	  // Get the current user when the application starts
	  // (in case they are still logged in from a previous session)
	  console.log("elsagApp.run!");
	  security.requestCurrentUser();
	  
	  //
	  if (security.isAuthenticated())
		  console.log("utente autenticato");
	  else
		  console.log("nessun utente autenticato");
	  
	  themes.initialize();
	  console.log("current theme ["+themes.getCurrentTheme()+"]");
//	  angular.element(document).ready(function (themes) {
//	        console.log('DOCUMENTO PRONTO!');
//	        themes.initialize();
//	        console.log("current theme ["+themes.getCurrentTheme()+"]");
//	  });
	  
	  
}]);


//Due to browsers issue, it's impossible to detect without a timeout any changes of autofilled inputs
//https://github.com/angular/angular.js/issues/1460
//https://github.com/angular/angular.js/issues/1460#issuecomment-28662156
//Could break future Angular releases (if use `compile()` instead of `link())
//TODO support select

elsagApp.config(["$provide", function($provide) {
 var inputDecoration = ["$delegate", "inputsWatcher", function($delegate, inputsWatcher) {
     var directive = $delegate[0];
     var link = directive.link;

     function linkDecoration(scope, element, attrs, ngModel){
         var handler;
         // By default model.$viewValue is equals to undefined
         if(attrs.type == "checkbox"){
             inputsWatcher.registerInput(handler = function(){
                 var value = element[0].checked;
                 // By default element is not checked
                 if (value && ngModel.$viewValue !== value) {
                     ngModel.$setViewValue(value);
                 }
             });
         }else if(attrs.type == "radio"){
             inputsWatcher.registerInput(handler = function(){
                 var value = attrs.value;
                 // By default element is not checked
                 if (element[0].checked && ngModel.$viewValue !== value) {
                     ngModel.$setViewValue(value);
                 }
             });
         }else{
             inputsWatcher.registerInput(handler = function(){
                 var value = element.val();
                 // By default value is an empty string
                 if ((ngModel.$viewValue !== undefined || value !== "") && ngModel.$viewValue !== value) {
                     ngModel.$setViewValue(value);
                 }
             });
         }

         scope.$on("$destroy", function(){
             inputsWatcher.unregisterInput(handler);
         });

         // Exec original `link()`
         link.apply(this, [].slice.call(arguments, 0));
     }

     // Decorate `link()` don't work for `inputDirective` (why?)
     /*
      directive.link = linkDecoration;
      */
     // So use `compile()` instead
     directive.compile = function compile(element, attrs, transclude){
         return linkDecoration;
     };
     delete directive.link;

     return $delegate;
 }];

 $provide.decorator("inputDirective", inputDecoration);
 $provide.decorator("textareaDirective", inputDecoration);
 //TODO decorate selectDirective (see binding "change" for `Single()` and `Multiple()`)
}]).factory("inputsWatcher", ["$interval", "$rootScope", function($interval, $rootScope){
 var INTERVAL_MS = 500;
 var promise;
 var handlers = [];

 function execHandlers(){
     for(var i = 0, l = handlers.length; i < l; i++){
         handlers[i]();
     }
 }

 return {
     registerInput: function registerInput(handler){
         if(handlers.push(handler) == 1){
             promise = $interval(execHandlers, INTERVAL_MS);
         }
     },
     unregisterInput: function unregisterInput(handler){
         handlers.splice(handlers.indexOf(handler), 1);
         if(handlers.length == 0){
             $interval.cancel(promise);
         }
     }
 }
}]);