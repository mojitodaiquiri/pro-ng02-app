
elsagApp.controller('HomeController', ['$rootScope','$scope','security',function ($rootScope,$scope,security) {

	console.log("HomeController::costruttore 001");
	$scope.isAuthenticated = security.isAuthenticated;
	$scope.isAdmin = security.isAdmin;
	$scope.hasRole = security.hasRole;
	$scope.hasPermission = security.hasPermission;
	$scope.showMenu=true;
	$rootScope.$on('request:toggleMenu', function(e) {
        console.log('received the request:toggleMenu event');
        $scope.showMenu = !$scope.showMenu;
    });
}]);


elsagApp.controller('HeaderController', ['$scope','security','themes',function ($scope,security,themes) {

	console.log("HeaderController::costruttore 001");
	$scope.isAuthenticated = security.isAuthenticated;
	$scope.isAdmin = security.isAdmin;
	$scope.hasRole = security.hasRole;
	$scope.hasPermission = security.hasPermission;
	
	$scope.getClass = function(theme){
		//console.log("HeaderController::getClass ["+theme+"]");
		if (themes.getCurrentTheme() == theme)
			return "icon-ok" ;
		else
			return "icon-blank";
		
	};
	
	$scope.changeTheme = function(theme){
		console.log("HeaderController::changeTheme ["+theme+"]");
		themes.changeTheme(theme);
	};
	
	
	$scope.toggleMenu = function() {
		console.log("toggle menu");
		$scope.$emit('request:toggleMenu');
	};
	
}]);



elsagApp.controller('MenuController', ['$scope','security',function ($scope,security) {

	console.log("MenuController::costruttore 001");
	$scope.isAuthenticated = security.isAuthenticated;
	$scope.isAdmin = security.isAdmin;
	$scope.hasRole = security.hasRole;
	$scope.hasPermission = security.hasPermission;
	$scope.testo=" prova ";
}]);


elsagApp.controller('DashboardController', ['$scope','messageService',function ($scope,messageService) {

	console.log("DashboardController::costruttore 001");
	messageService.getMessageHello(function(data){
		  $scope.hello = data.hello;
	  });
}]);


elsagApp.controller('SesTablesController', ['$scope', '$log', 'ngTableParams','$filter','userService', function ($scope,$log, ngTableParams,$filter,userService) {

	console.log("SesTablesController::costruttore 001");

	$scope.tableParams = new ngTableParams({
		page: 1,            // show first page
		count: 10,          // count per page
		filter: {
			name: '',       // initial filter
			role: '',       // initial filter
		}
	},
	/*	    
	    {
	        total: data.length, // length of data
	        getData: function($defer, params) {
	            // use build-in angular filter
	            var orderedData = params.filter() ?
	                   $filter('filter')(data, params.filter()) :
	                   data;
	            $scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
	            params.total(orderedData.length); // set total for recalc pagination
	            $defer.resolve($scope.users);
	     }
	 */
	{
		total: 0, // length of data
		getData: function($defer, params) {

			var arrSearch = [];
			var obj = params.filter();
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					arrSearch.push(key + '=' + obj[key]);
				}
			};
			var queryString="page="+params.page()+"&pageSize="+params.count()+"&search="+arrSearch.join(',')+"&orderBy="+params.orderBy().join(',');
			userService.getAll(queryString).then(function(result) {
				console.log("result ["+JSON.stringify(result)+"]");
				params.total(result.data.total);
				$defer.resolve($scope.users = result.data.members);
				//$scope.meta = result.meta;

				$log.debug('ok fetching users:', result.data.members);
			}, function(result) {
				console.log("result ["+JSON.stringify(result)+"]");
				$log.debug('error fetching users:', result);
			});
		}
	}

	); 

	$scope.checkboxes = { 'checked': false, items: {} };

	// watch for check all checkbox
	$scope.$watch('checkboxes.checked', function(value) {
		angular.forEach($scope.users, function(item) {
			if (angular.isDefined(item.id)) {
				$scope.checkboxes.items[item.id] = value;
			}
		});
	});
	// watch for data checkboxes
	$scope.$watch('checkboxes.items', function(values) {
		if (!$scope.users) {
			return;
		}
		var checked = 0, unchecked = 0,
		total = $scope.users.length;
		angular.forEach($scope.users, function(item) {
			checked   +=  ($scope.checkboxes.items[item.id]) || 0;
			unchecked += (!$scope.checkboxes.items[item.id]) || 0;
		});
		if ((unchecked == 0) || (checked == 0)) {
			$scope.checkboxes.checked = (checked == total);
		}
		// grayed checkbox
		angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
	}, true); 

}]);

//aggiunta lucci x tablesDetail
elsagApp.controller('SesTabDetailController', ['$scope','$stateParams','ngTableParams', '$log','$filter','userService',function ($scope,$stateParams,ngTableParams,$log, $filter,userService) {

	console.log("SesTabDetailController::costruttore 001");
	$scope.message = 'This is Add new SesTabDetail screen';

	// recupero user id dalla view sestables
	$scope.user_id = $stateParams.userId;

	// uso lo userid nel servizio per recuperare i suoi dati
	$log.debug('sono nel controller userid:', $scope.user_id);
	
	var queryString="userId="+$scope.user_id;
	
	userService.getUser(queryString).then(function(result) {
		console.log("result ["+JSON.stringify(result)+"]");

		$scope.user_detail = result.data.member;
		$log.debug('ok fetching user:', result.data.member);
		
		$scope.userLoginData = result.data.datiLogin;
		$log.debug('ok fetching userLoginData:', result.data.datiLogin);
		
		$scope.userAttachData = result.data.datiAttachment;
	
		$log.debug('ok fetching userAttachData:', result.data.datiAttachment);
		
	}, function(result) {
		console.log("result ["+JSON.stringify(result)+"]");
		$log.debug('error fetching user:', result);
	});
	
	// tabella dei login
	$scope.tableLogin = new ngTableParams({
		page: 1,            // show first page
		count: 10,         // count per page
		total: 0
	});
	
	// tabella dei login
	$scope.tableAttach = new ngTableParams({
		page: 1,            // show first page
		count: 10,         // count per page
		total: 0
	});

	// gestione tabs
	  $scope.tabs = [{
          title: 'Dati Anagrafici',
          url: 'one.tpl.html'
      }, {
          title: 'Dati Login',
          url: 'two.tpl.html'
      }, {
          title: 'Attachments',
          url: 'three.tpl.html'
  }];
	  
	  $scope.currentTab = 'one.tpl.html';

	    $scope.onClickTab = function (tab) {
	        $scope.currentTab = tab.url;
	    };
	    
	    $scope.isActiveTab = function(tabUrl) {
	        return tabUrl == $scope.currentTab;
	    };
	  
	    $scope.OpenInNewTab = function (url) {
	    	  var win = window.open(url, '_blank');
	    	  win.focus();
	    };
	    
}]);



elsagApp.controller('OrdersController', ['$scope', '$log', 'ngTableParams','$filter','orderService', function ($scope,$log, ngTableParams,$filter,orderService) {

	console.log("OrdersController::costruttore 001");
	$scope.delay = 0;
	$scope.minDuration = 0;
	$scope.message = 'Attendere  ...';
	$scope.backdrop = true;
	$scope.promise = null;
	
	 $scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: 10,          // count per page
	        filter: {
	            material: '',       // initial filter
	            description: ''       // initial filter
	        }
	    },
	    {
	        total: 0, // length of data
	        getData: function($defer, params) {
	        	
	        	var arrSearch = [];
	        	var obj = params.filter();
	        	for (var key in obj) {
	        	    if (obj.hasOwnProperty(key)) {
	        	    	arrSearch.push(key + '=' + obj[key]);
	        	    }
	        	};
	        	var queryString="page="+params.page()+"&pageSize="+params.count()+"&search="+arrSearch.join(',')+"&orderBy="+params.orderBy().join(',');
	        	$scope.promise = orderService.getAll(queryString); 
	        	$scope.promise.then(function(result) {
	        		console.log("result ["+JSON.stringify(result)+"]");
	                params.total(result.data.total);
	                $defer.resolve(result.data.orders);
	                //$scope.meta = result.meta;
	                
	                $log.debug('ok fetching orders:', result.data.orders);
	              }, function(result) {
	            	console.log("result ["+JSON.stringify(result)+"]");
	                $log.debug('error fetching orders:', result);
	              });
	        }
	    }
	    
	    ); 




}]);



elsagApp.controller('PdfviewController', ['$scope', 'PDFViewerService', function ($scope,pdf) {

	console.log("PdfviewController::costruttore 001");
	$scope.pdfURL = "/pro-ng02/assets/test.pdf";

	$scope.instance = pdf.Instance("viewer");

	$scope.nextPage = function() {
		$scope.instance.nextPage();
	};

	$scope.prevPage = function() {
		$scope.instance.prevPage();
	};

	$scope.gotoPage = function(page) {
		$scope.instance.gotoPage(page);
	};

	$scope.pageLoaded = function(curPage, totalPages) {
		console.log("PdfviewController::pageLoaded ["+curPage+"] ["+totalPages+"]");
		$scope.currentPage = curPage;
		$scope.totalPages = totalPages;
	};

	$scope.loadProgress = function(loaded, total, state) {
		console.log('loaded =', loaded, 'total =', total, 'state =', state);
	};

}]);



elsagApp.controller('PdfviewController2', ['$scope','$sce','$http', function ($scope,$sce,$http) {

	console.log("PdfviewController2::costruttore 001");
	
	$http.get('assets/test.pdf',{}, {responseType:'arraybuffer'})
	  .success(function (response) {
	       var file = new Blob([response], {type: 'application/pdf'});
	       var fileURL = URL.createObjectURL(file);
	       $scope.content = $sce.trustAsResourceUrl(fileURL);
	});

}]);

elsagApp.controller('PdfviewController3', ['$scope','$window', function ($scope,$window) {

	console.log("PdfviewController3::costruttore 001");
	$window.open("assets/test.pdf");

}]);


