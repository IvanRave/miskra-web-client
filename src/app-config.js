(function(angular) { 
  'use strict';
  
  var xpo = function($anchorScrollProvider,
					 $sceProvider,
					 $compileProvider,
					 localStorageServiceProvider) {

	$sceProvider.enabled(true);


	// $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|skype):/);

	//	$compileProvider.aHrefSanitizationWhitelist(/^\s*(app|skype):/);
	
	// https://docs.angularjs.org/guide/production
	$compileProvider.debugInfoEnabled(true);
	
	$anchorScrollProvider.disableAutoScrolling();	    
    
    // all values in storage will be ppa.somevalue
    // https://github.com/grevory/angular-local-storage
    localStorageServiceProvider
      .setPrefix('ppa')
      .setStorageType('localStorage');

    // Disable: put session id to requests in API helper
    //          only for API requests (not for others, such CSS, JS files)
    // jwtInterceptorProvider.tokenGetter = [
    //   function() {
    //     return sid;
    //   }
    // ];

    // $httpProvider.interceptors.push('jwtInterceptor');
  };

  angular.module('myApp.appConfig', [
    'LocalStorageModule', // bower angular-local-storage
    'myApp.templateFactory', // auto-generated to template-cache using tcache task in gulp
    //'angular-jwt',
    // implemented in index.html as main controller of the app
    'myApp.readiness',
    'myApp.lgr',
	'ngSanitize'
  ])

	.config(['$anchorScrollProvider',
			 '$sceProvider',
			 '$compileProvider',
			 'localStorageServiceProvider',
			 //'jwtInterceptorProvider',	   
			 xpo
			]);
  
//	.value('$anchorScroll', angular.noop);

}(window.angular));
