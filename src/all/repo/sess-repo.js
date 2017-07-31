(function(window, angular, SNNS){
  'use strict';

  var repoData = {
	/**
	 * Expired, utc unix timestamp, int32
	 * @type {Number}
	 */
	exp: null,

	/**
	 * User id, 6-digits int32
	 * @type {Number}
	 */
	uid: null,

	/**
	 * Perms, bitmask, int32
	 * @type {Number}
	 */
	perms: null,

	/**
	 * Whether the repo is already filled
	 * @type {Boolean}
	 */
	is_loaded: false
  };

  var parseToken = function(tkn){
	var str = '';

	var payload = tkn.split('.')[1];
	if (!payload){
	  return null;
	}
	
	try {
	  str = window.atob(payload);
	}
	catch(exc){
	  console.log(exc);
	  return null;
	}

	var result;

	try {
	  result = JSON.parse(str);
	}
	catch(exc){
	  console.log(exc);
	  return null;
	}

	return result;
  };
  
  var xpo = function($q, localDb){
	var tblName = 'sess';
	var idDefault = 0;

	var setData = function(payload){
	  //console.log(payload);

	  repoData.token = payload.token;
	  
	  repoData.exp = payload.exp;
	  repoData.perms = payload.perms;
	  repoData.uid = payload.uid;
	  repoData.is_supplier = payload.is_supplier;
	  repoData.is_editor = payload.is_editor;
	  // is_moder includes is_editor
	  repoData.is_moder = payload.is_moder;

	  repoData.avatar = payload.avatar;	  
	  repoData.fname = payload.fname;
	  repoData.lname = payload.lname;	  

	  repoData.is_loaded = true;
	};

	var cleanData = function(){
	  console.log('no auth: clean data');
	  repoData.exp = null;
	  repoData.perms = null;
	  repoData.uid = null;
	  repoData.is_supplier = false;
	  repoData.is_editor = false;
	  repoData.is_moder = false;
	  
	  repoData.avatar = null;
	  repoData.fname = null;
	  repoData.lname = null;
	  
	  repoData.is_loaded = true;
	};
	
	return {
	  getData: function() {
		return repoData;
	  },
	  // A user may remove a token from localStorage
	  // In this case - no two-binding - no view refreshing
	  // Need to:
	  //  - refresh page (new auth value will be setted)
	  //  - logout, using app buttons (all will be cleaned)
	  
	  retrieveSess: function(){
		if (repoData.is_loaded){
		  //console.log('sess: cache');
		  return $q.when();
		}
		//console.log('sess: initial');
		// depends of app: VK, site, etc.
		// Site, Android, IPhone: get from localStorage
		// VK, FB: get from social methods
		if (SNNS.getAuthUser){
		  var dfr = $q.defer();		  
		  
		  SNNS.getAuthUser(function(err, authUser){
			if (err){
			  dfr.reject(err.message);
			} else {
			  dfr.resolve(authUser);
			}
		  });

		  var prms = dfr.promise;

		  prms.then(function(authUser){
			console.log('setDataAuthUser', authUser);
			setData({
			  // vk_id
			  uid: authUser.id,
			  // is_customer
			  is_supplier: false,
			  is_editor: false,
			  is_moder: false,
			  fname: authUser.first_name,
			  lname: authUser.last_name,
			  avatar: authUser.photo_50
			});
		  });
		  
		  return prms;
		} else {
		  
		  
	  	  return localDb.readFromStorage(tblName, {
	  		id: idDefault
	  	  }, false)
			.then(function(record){
			  //console.log(record);
			  if (!record || !record.token){
				cleanData();
				return null;
				// return $q.reject('Ошибка авторизации: неправильный токен1.');
			  }
			  
			  var payload = parseToken(record.token);

			  if (!payload){
				return $q.reject('Ошибка авторизации: неправильный токен');
			  }

			  setData({
				uid: payload.uid,
				token: record.token,
				is_supplier: ([1,2,3].indexOf(payload.uid) === -1),
				is_editor: ([2,3].indexOf(payload.uid) >= 0),
				is_moder: ([2].indexOf(payload.uid) >= 0)
			  });

			  return null;// nothing to return
			});
		  // handle a error event in main code
		}
	  },
	  updateSess: function(authToken){
		var payload = parseToken(authToken);

		if (!payload){
		  return $q.reject('Ошибка авторизации: неправильный токен');
		}

		setData({
		  uid: payload.uid,
		  token: authToken,
		  is_supplier: ([1,2,3].indexOf(payload.uid) === -1),
		  is_editor: ([2,3].indexOf(payload.uid) >= 0),
		  is_moder: ([2].indexOf(payload.uid) >= 0)
		});
		
		return localDb.writeToStorage(tblName, {
		  id: idDefault,
		  token: authToken
		});
	  },
	  deleteSess: function(){
		cleanData();
		
		return localDb.delFromStorage(tblName, {
		  id: idDefault
		});
	  }
	};
  };
  
  angular.module('myApp.sessRepo', [
	'myApp.localDb'
  ])
	.factory('sessRepo', [
	  '$q',
	  'localDb',
	  xpo
	]);

})(window, window.angular, window.snns);
