(function(angular, APPCONF, undefined){
  'use strict';

  var split_tokens = {
	'code':'?',
	'token':'#'
  };
  
  var isInAppBrowserInstalled = function(cordovaMetadata){
	var inAppBrowserNames = ["cordova-plugin-inappbrowser", "org.apache.cordova.inappbrowser"];

	return inAppBrowserNames.some(function(name) {
	  return cordovaMetadata.hasOwnProperty(name);
	});
  };

  var parseResponseParameters = function (response) {
	if (response.split) {
	  var parameters = response.split("&");
	  var parameterMap = {};
	  for(var i = 0; i < parameters.length; i++) {
		parameterMap[parameters[i].split("=")[0]] = parameters[i].split("=")[1];
	  }
	  return parameterMap;
	}
	else {
	  return {};
	}
  };

  var handleAuthResponse = 	function(dfr,
									 response_uri,
									 response_type){
	
	var callbackResponse = (response_uri).split(split_tokens[response_type])[1];
	var parameterMap = parseResponseParameters(callbackResponse);
	if(parameterMap.access_token !== undefined && parameterMap.access_token !== null) {
	  dfr.resolve({
		access_token: parameterMap.access_token
	  });
	} else if(parameterMap.code !== undefined && parameterMap.code !== null) {
	  dfr.resolve({
		code: parameterMap.code
	  });
	} else {
	  dfr.reject("Problem authenticating");
	}
  };

  var loginBrowser = function($q,
							  win_uri,
							  redirect_uri,
							  response_type){
	var dfr = $q.defer();
	// dfr.reject("Cannot authenticate via a web browser");
	
	var wnd = window.open(win_uri,
						  'windowName',
						  'location=0,status=0,width=800,height=400');

	var cbkTimeout = function(){
 	  console.log(wnd);
	  
	  try{
		if (wnd.document){
		  var cur_uri = wnd.document.URL;

		  if (cur_uri.indexOf(redirect_uri) >= 0){
			console.log(cur_uri);
			window.clearInterval(ntrv);
			wnd.close();
			handleAuthResponse(dfr, cur_uri, response_type);
		  }
		}
	  }
	  catch(exc){
		console.log('myexc', exc);
	  }
	  
	  if (wnd.closed) {
		window.clearInterval(ntrv);
		dfr.reject('Auth is cancelled');
	  }
	};
	
	var ntrv = window.setInterval(cbkTimeout, 1500);

	return dfr.promise;
  };

  var loginCordova = function($q,
							  win_uri,
							  redirect_uri,
							  response_type){

	var deferred = $q.defer();

	var cordovaMetadata = window.cordova.require("cordova/plugin_list").metadata;
	
	if(isInAppBrowserInstalled(cordovaMetadata) !== true) {
	  deferred.reject("Could not find InAppBrowser plugin");
	  return deferred.promise;
	}
	
	var browserRef = window.open(win_uri, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');

	var onLoadStart = function(event) {
	  if((event.url).indexOf(redirect_uri) === 0) {
		browserRef.removeEventListener("exit", function(){});
		// function(event)
		browserRef.close();

		handleAuthResponse(deferred, event.url, response_type);
	  }
	};
	
	browserRef.addEventListener('loadstart', onLoadStart);
	
	browserRef.addEventListener('exit', function() { // event
	  deferred.reject("The sign in flow was canceled");
	});		
	
	return deferred.promise;
  };
  
  var xpo = function($q){
	return {
	  loginVkn: function(client_id,
	  					 response_type,
	  					 redirect_uri,
	  					 app_scope){
		
	  	var win_uri = APPCONF.OAUTH_VKN_URI +
	  		  '?client_id=' + client_id +
			  // http://oauth.vk.com/blank.html
	  		  '&redirect_uri=' + redirect_uri +
			  // token
	  		  '&response_type=' + response_type +
	  		  '&display=touch';

	  	if (app_scope && app_scope.length > 0){
	  	  win_uri += '&scope=' + app_scope.join(",");
	  	}

		// /callback?error=access_denied&error_reason=user_denied&error_description=User%20denied%20your%20request
		// /callback?code=1231231

		if(window.cordova) {
		  return loginCordova($q,
							  win_uri,
							  redirect_uri,
							  response_type);
		} else {
		  return loginBrowser($q,
							  win_uri,
							  redirect_uri,
							  response_type);
		}
	  },
	  /*
       * Sign into the Instagram service
       *
       * @param    string clientId
       * @param    array appScope
       * @param    object options
       * @return   promise
	   */
	  loginNstg: function(client_id,
						  response_type,
						  redirect_uri,
						  app_scope) {

		// redirect_uri = "http://localhost/callback"; for mobile

		var win_uri = APPCONF.OAUTH_NSTG_URI +
			  '?client_id=' + client_id +
			  '&redirect_uri=' + redirect_uri +
			  '&response_type=' + response_type;

		if (app_scope && app_scope.length > 0) {
		  win_uri += '&scope=' + app_scope.join(" ");
		}
		
		if(window.cordova) {
		  return loginCordova($q,
							  win_uri,
							  redirect_uri,
							  response_type);
		} else {
		  return loginBrowser($q,
							  win_uri,
							  redirect_uri,
							  response_type);
		}
	  }
	};
  };

  angular.module('myApp.oauthEntry', [])
	.factory('oauthEntry', [
	  '$q',
	  xpo
	]);
  
})(window.angular, window.APPCONF, undefined);
