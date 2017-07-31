(function(angular){
  'use strict';

  /**
   * Local storage id to store permission switcher
   */
  var PERM_TABLE = 'location_permission';

  /**
   * Whether the location permissions are allowed
   * @type {boolean}
   */
  var is_perm_allowed = null;
  
  // NullBoolean
  var repoData = {
    /**
     * Whether the auto-recognition is tried
     *   once per app
     */
    is_perm_checked: false
  };
  
  var xpo = function($q, localDb){

    var saveLocationPermission = function(){
      is_perm_allowed = true;
      // save a rule: a user allows us to define his location
      localDb.writeToStorage(PERM_TABLE, {
        id: 0,
        is_allowed: true
      });
    };

    var handleLocationPermission = function(prm) {
      repoData.is_perm_checked = true;
      
      if (prm && (prm.is_allowed === true)) {
		// calc location from coords
        //$scope.defineLocation();
		//saveLocationPermission();
		is_perm_allowed = true;
      }
      else {
		is_perm_allowed = false;
      }

      return is_perm_allowed;
    };
    
    return {
      getData: function(){
		return repoData;
      },
      cleanLocationPermission: function(){
		is_perm_allowed = false;
		localDb.delFromStorage(PERM_TABLE, {
          id: 0
		});
      },
      saveLocationPermission: saveLocationPermission,
      // return or (load and return)
      checkLocationPermission: function(){
		// checked once per session
        if (repoData.is_perm_checked){
		  var dfr = $q.defer();
		  dfr.resolve(is_perm_allowed);
		  return dfr.promise;
		}
		else {
		  return localDb.readFromStorage(PERM_TABLE, {
            id: 0
		  }, false).then(handleLocationPermission);
		}
      }
    };
  };
  
  angular.module('myApp.permRepo', [
    'myApp.localDb'
  ])

    .factory('permRepo', [
      '$q',
      'localDb',
      xpo]);
  
  
})(window.angular);
