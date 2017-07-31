/**
 * Saves, retrieves and removes data from localstorage as tables
 */
(function(angular) {
  'use strict';

  function xpo($log, $q, localStorageService) {

    /**
     * Check an item: when all params matches - then true
     * @param {Object} params - { key1: val1, key2: val2}
     *         if params = {} - then true
     * @param {Object} item - item in array
     */
    function checkReadItem(params, item) {
      var isPassed = true;
      angular.forEach(params, function(paramValue, paramKey) {
        if (item[paramKey] !== paramValue) {
          // an every param must match
          isPassed = false;
        }
      });
      return isPassed;
    }

    /**
     * Get an item from storage:
     *     - Get an array from storage (from endpoint table)
     *     - Convert to real array from String
     *     - Find items by params (filter)
     *     - Return it as an array (if isArray) or item
     *       - If isArray=false must be zero or one item only (in other cases - error)
     */
    function readFromStorage(tblName, params, isArray) {
      var deferred = $q.defer();

      var tbl = localStorageService.get(tblName);
      if (!tbl) {
        //$log.log('tbl not found', tbl, tblName);
        deferred.resolve(isArray ? [] : null);
      }
      else {
        var arr = angular.fromJson(tbl);
        //$log.log(arr);
        var needItems = arr
			  .filter(angular.bind(null, checkReadItem, params));

        if (isArray) {
          deferred.resolve(needItems);
        }
        else {
          if (needItems.length > 1) {
            deferred.reject('notOnlyOne');
          }
          else {
            // undefined or fullfiled item
            deferred.resolve(needItems[0]);
          }
        }
      }

      return deferred.promise;
    }

    /**
     * Write (update or insert): steps:
     *    get a table by endpoint, like 'pants'
     *    get all items, like [{}, {}] as a String
     *    convert to JSON array
     *    push the new item (obj)
     *    convert to String
     *    write to storage
     */
    function writeToStorage(tableName, obj) {
      var dfr = $q.defer();
      var tbl = localStorageService.get(tableName);

      var arr = tbl ? angular.fromJson(tbl) : [];

      var cur = arr.filter(function(item, ind) {
        if (item.id === obj.id) {
          arr[ind] = obj;
          return true;
        }
        return false;
      })[0];

      if (!cur) {
        arr.push(obj);
      }

      localStorageService.set(tableName, angular.toJson(arr));

      // Return created (updated) object
      dfr.resolve(obj);

      return dfr.promise;
    }

    /**
     * Del from a storage:
     *     - Find a table by endpoint
     *     - Convert to JSON
     *     - Find an object in a table and delete
     * @param {String} tblName
     * @param {Object} obj - Object to delete
     *                 if {} empty - remove all objects
     */
    function delFromStorage(tblName, obj) {
      var dfr = $q.defer();
      var tbl = localStorageService.get(tblName);
      if (tbl) {
        
		var arr = angular.fromJson(tbl);

		// delete all matched items (usually it's only one - unique constraint)
		angular.forEach(arr, function(item, ind) {
          if (checkReadItem(obj, item)) {
            arr.splice(ind, 1);
          }
		});

		localStorageService.set(tblName, angular.fromJson(arr));
      }
      dfr.resolve();
      return dfr.promise;
    }

    return {
      writeToStorage: writeToStorage,
      readFromStorage: readFromStorage,
      delFromStorage: delFromStorage
    };

  }

  angular.module('myApp.localDb', [
    'LocalStorageModule'
  ])

    .factory('localDb', [
      '$log',
      '$q',
      'localStorageService',
      xpo
    ]);

})(window.angular);
