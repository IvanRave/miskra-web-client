(function(angular, SNNS, lytic) { 
  'use strict';

  function getUrlParts(url) {
	var a = document.createElement('a');
	a.href = url;

	return {
	  href: a.href,
	  host: a.host,
	  hostname: a.hostname,
	  port: a.port,
	  pathname: a.pathname,
	  protocol: a.protocol,
	  hash: a.hash,
	  search: a.search
	};
  }

  function getRelativeUrl(absUrl){
	var parts = getUrlParts(absUrl);

	return parts.pathname +
	  (parts.search || '') +
	  (parts.hash || '');
  }
  
  var runXpo = function($rootScope, statePrev) {

	var cbkChangeSuccess = function(evt,
									absNewUrl, absOldUrl) {
	  //	 newState, oldState
	  //console.log('success', evt, absNewUrl, absOldUrl);
	  // equals for first enter
	  if (absOldUrl === absNewUrl){
		statePrev.url = null;
	  }
	  else {
		statePrev.url = absOldUrl;
		//console.log(absOldUrl, absNewUrl);
	  }

	  // console.log('toState', getRelativeUrl(absNewUrl));
	  // new path as an argument
	  lytic.trackPage(getRelativeUrl(absNewUrl));
	  //$state.href(fromState.name, fromParams);
	};
	
	// stateChange events doesnt works with hashes
	// New history state object
	$rootScope.$on('$locationChangeSuccess', cbkChangeSuccess);

	// Define window.title on a page level dinamically, like
	//   name of a master or a city or rubric name
  };

  /**
   * @ngdoc module
   * @name myApp
   * @description
   *
   * Declare app level module which depends on views
   *
   * #Usage
   *
   * To see some sees
   */
  angular.module('myApp', [
	'ngAria',
	// todo: re-back after phantom bag
	'ngSanitize',
    'myApp.appConfig',
	'myApp.routeConfig',
	// register all events
	'myApp.analyticsOn',
	'myApp.statePrev'
  ])

    .run([
	  '$rootScope',
	  'statePrev',
	  // '$window',	  
	  // '$location',
	  // '$state',
	  runXpo]);


  
  // http://stackoverflow.com/questions/20692203/cordova-deviceready-event-not-firing-from-within-angular-run-block
  var loadTheApp = function() {
	console.log('waitWhileInit...');
	// window.setTimeout(function(){
	SNNS.waitWhileInit(function(err){
	  if (err){
		alert(err.message);
		return;
	  }

      if (!window.APPCONF.XUID){
        console.warn('XUID');
      }

      if (!window.APPCONF.XSID){
        console.warn('XSID');
      }     
	  
 	  var els = document.getElementsByClassName("start-loader");
	  
	  if (els[0]){	  
		els[0].style.display = 'none';
	  }

	  //console.log('bootstraped');
	  
      angular.bootstrap(document, ['myApp'], {
		// https://docs.angularjs.org/guide/production
		strictDi: true
	  });
	  // var appwrap = document.getElementById('appwrap');
	  // appwrap instead document
	});
	// }, 60000);
  };

  console.log('starting...');

  angular.element(document).ready(function() {
	if (window.cordova) {
	  console.log('cordova initialized');
      document.addEventListener('deviceready', loadTheApp, false);
	}
	else {
      loadTheApp();
	}
  });

  // var Mytag = document.registerElement('my-tag');
  // document.body.appendChild(new Mytag());

  // var mytag = document.getElementsByTagName("my-tag")[0]; 
  // mytag.textContent = "I am a my-tag element.";

  // var tmpl = document.querySelector('template'); //Step 1
  
})(window.angular, window.snns, window.LYTIC);
