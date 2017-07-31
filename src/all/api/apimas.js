// TODO: move all apimas endpoints to this factory
(function(angular, APPCONF){
  'use strict';  

  var objToForm = function(obj) {
	var str = [];
	for(var p in obj){
	  // skip null fields
	  if (obj[p] !== null) {
		// skip all related, nested objects
		if (typeof obj[p] !== 'object'){
		  str.push(encodeURIComponent(p) +
				   "=" + encodeURIComponent(obj[p]));
		}
	  }
	}
	return str.join("&");
  };
  
  var xpo = function($http, $q, sessRepo, apimasCache, Upload){
	apimasCache.removeAll();

	var sendMultipart = function(endpoint, file){
	  // calculate authToken from localStorage
	  var authToken = sessRepo.getData().token;

	  if (!authToken){
		return $q.reject('Требуется авторизация: войдите в личный кабинет.');
	  }

	  return Upload.upload({
		url:  APPCONF.APIMAS_POST_ENDPOINT + endpoint,
		method: 'POST',
		data: {
		  ufile: file
		  // 'username': $scope.username
		},
		headers: {
		  'Authorization': 'Bearer ' + authToken
		}
	  });
	};
	
	var sendPost = function(endpoint, bodyParams){

	  // calculate authToken from localStorage
	  var authToken = sessRepo.getData().token;

	  if (!authToken){
		return $q.reject('Требуется авторизация: войдите в личный кабинет.');
	  }
	  
	  return $http({
		method: "POST",
		url: APPCONF.APIMAS_POST_ENDPOINT + endpoint,
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		  'Authorization': 'Bearer ' + authToken
		},
		data: objToForm(bodyParams)
		// params: {
		//   token: 'super-key'
		// }
	  })
		.then(r => r.data)
		.catch(function(err){
		  if (err.status === 401){
			// auth token is expired or smth else
			// remove auth
			sessRepo.deleteSess();
			// todo: realize after v2
			// expired token
			// eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NTEwMzYxNTgsInBlcm1zIjoyLCJ1aWQiOjN9.N4cu1tVg5EVJBPtic6mJis8u_z_wyeRwO4lT9oJxWGWGSFPw5xxkRcIaHGs8anLsem0p1iIVW_9a2u19UcabyLc69XTaQMdkF0mDFGF1Jxy2P1_-cN_DtAYrgzVroKy5xSnCqSHvmOBy_o78dkQECmN-TLAlCxeeWX0eTeq6Ur4
			//alert('Требуется авторизация: войдите в личный кабинет.');
		  }
		  //console.log('handle err', err);
		  // hande other errors on a client
		  return $q.reject(err);
		});
	};

	/**
	 * POST method without AUTH header
     * Returns authtoken
	 */
	var sendLogin = function(bodyParams){
	  return $http({
		method: "POST",
		url: APPCONF.APIMAS_POST_ENDPOINT + '/sess/login',
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		data: objToForm(bodyParams)
		// params: {
		//   token: 'super-key'
		// }
	  }).then(r => r.data);
	};

	var sendReportNoImage = function(bodyParams){
	  return $http({
		method: "POST",
		url: APPCONF.APIMAS_POST_ENDPOINT + '/work/report-no-image',
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		data: objToForm(bodyParams)
	  }).then(r => r.data);
	};

    // sends a letter
	var sendRegFree = function(bodyParams){
	  return $http({
		method: "POST",
		url: APPCONF.APIMAS_POST_ENDPOINT + '/sess/reg-free',
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		data: objToForm(bodyParams)
	  }).then(r => r.data);
	};

    /**
     * Send a log message to admin
     */
    var sendLog = function(msg){
      var bodyParams = {
        link: msg
      };
      
	  return $http({
		method: "POST",
		url: APPCONF.APIMAS_POST_ENDPOINT + '/sess/reg-free',
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		data: objToForm(bodyParams)
	  }).then(r => r.data);
	};

	/**
	 * Send oauth
	 * @param {String} tkn - access_token or code, 
	 *        retrieved from issuer by oauth flow
	 * @param {String} response_type - token or code
	 * @param {String} redirect_uri - Uri to redirect,
	 *        the same, as used in oauth flow
	 * @param {String} issuer_id - Like 'nstg', 'facebook', etc
	 * @return promise
	 *         http returns auth token (JWT format)
	 */
	var sendOauth = function(tkn,
							 response_type,
							 redirect_uri,
							 issuer_id){
	  var bodyParams = {
		tkn: tkn,
		response_type: response_type,
		redirect_uri: redirect_uri,
		issuer_id: issuer_id
	  };

	  console.log(bodyParams);

	  return $http({
		method: "POST",
		url: APPCONF.APIMAS_POST_ENDPOINT +'/sess/oauth',
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		  // 'Authorization': 'Bearer ' + authToken
		},
		data: objToForm(bodyParams)
		// params: {
		//   token: 'super-key'
		// }
	  }).then(r => r.data);
	  
	  // return $q.when({
	  //   auth_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0Mzg2OTQ5OTAsInBlcm1zIjoxMTIsInVpZCI6MTE1NjcwfQ.PG1eJctEG4XAfiFPfEAp1oQun3bd_HSWozxeSuH02JHpS2G4olqbY3VcLuNHKMipkmJlVdRW6Xk8fe2a0X3Nxyi8lL3mjwOrTIOBSDQXZ2Q9enP0Dm2nu69na5k4TERqsa20KYYporAqhDU88Zu60HH-sHyw2Fg4YfGLARVciCc'
	  // });
	};

    /**
     * Generates a verification code and send it to this email
     */ 
    var sendVcodeEmail = function(tmpEmail){      
	  // return $q.when({lgn: tmpEmail});
      // return $q.reject({
      //   status: 500,
      //   data: {
      //     errkey: 'duplicateKeyError',
      //     details: {
      //       property: "lgn_again",
      //       msg: 'some message for developer'
      //     }
      //   }
      // });
      var bodyParams = {
        lgn: tmpEmail,
        lgn_again: tmpEmail
      };
      
      return $http({
        method: 'POST',
        url: APPCONF.APIMAS_POST_ENDPOINT + '/sess/vcode-email',
        headers: {
	      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'		 
	    },
        data: objToForm(bodyParams)
      }).then(r => r.data);
    };

    /**
     * Verifies a login and email
     * Returns authtoken, like a /login method
     */
    var sendLoginEmail = function(tmpEmail, tmpVcode){
      // return $q.reject({
      //   status: 422,
      //   data: {
      //     errkey: 'validationError',
      //     details: {
      //       code: "errMaxRetry",
      //       msg: 'some message for developer'
      //     }
      //   }
      // });
      
      // returns authToken
	  // return $q.when({
	  //   auth_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0Mzg2OTQ5OTAsInBlcm1zIjoxMTIsInVpZCI6MTE1NjcwfQ.PG1eJctEG4XAfiFPfEAp1oQun3bd_HSWozxeSuH02JHpS2G4olqbY3VcLuNHKMipkmJlVdRW6Xk8fe2a0X3Nxyi8lL3mjwOrTIOBSDQXZ2Q9enP0Dm2nu69na5k4TERqsa20KYYporAqhDU88Zu60HH-sHyw2Fg4YfGLARVciCc'
	  // });

      var bodyParams = {
        lgn: tmpEmail,
        vcode: tmpVcode
      };
      
      return $http({
        method: 'POST',
        url: APPCONF.APIMAS_POST_ENDPOINT + '/sess/login-email',
        headers: {
	      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'		 
	    },
        data: objToForm(bodyParams)
      }).then(r => r.data);
    };

	/**
	 * @param {bool?} isFresh
	 */
	var sendGet = function(endpoint, urlParams, isFresh){
	  if (isFresh){
		// version of a data (only fresh)
		urlParams.v = new Date().getTime();
	  }
	  
	  return $http({
		method: "GET",
		url: APPCONF.APIMAS_ENDPOINT + endpoint,
		// headers: {		  
		//   'Authorization': 'super key'
		// },
		params: urlParams
		//cache: apimasCache
	  }).then(r => r.data);
	};

	return {
	  /**
	   * Post request, with Auth Header
	   */
	  sendPost: sendPost,
	  /**
	   * Post request with multipart/form-data
	   */
	  sendMultipart: sendMultipart,
	  /**
	   * Get request without auth
	   */
	  sendGet: sendGet,
      /**
       * Send a log message and other data
       */
      sendLog: sendLog,
	  /**
	   * Login method, lgn + pwd instead auth header
	   */
	  sendLogin: sendLogin,
	  /**
	   * Send reg-free form
	   */
	  sendRegFree: sendRegFree,
	  /**
	   * Login by OAuth token or code
	   */
	  sendOauth: sendOauth,
      /** Generate a verification code for an email */
      sendVcodeEmail: sendVcodeEmail,
      //sendVcodePhone
      sendLoginEmail: sendLoginEmail,
      //sendLoginPhone
	  /**
	   * Send a report with unavailable image work
	   */
	  sendReportNoImage: sendReportNoImage
	};
  };
  
  angular.module('myApp.apimas', [
	'myApp.sessRepo',
	'ngFileUpload'
  ])

	.factory('apimasCache', [
	  '$cacheFactory',
	  function($cacheFactory){
		return $cacheFactory('apimas-cache');
	  }
	])
  
	.factory('apimas', [
	  '$http',
	  '$q',
	  'sessRepo',
	  'apimasCache',
	  'Upload',
	  xpo]);
  
})(window.angular, window.APPCONF);
