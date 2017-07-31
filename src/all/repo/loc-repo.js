/**
 * Device coordinates
 */
(function(angular){
  'use strict';

  var repoData = {
    coords: {
      lat: null,
      lng: null
    }
  };

  var xpo = function($q, geolocFactory) {
    
    return {
	  retrieveByIp: function(){
	  	if (repoData.coords.lng && repoData.coords.lat){
	  	  return $q.when(repoData.coords);
	  	} else {
		  return geolocFactory.getByIp()
			.then(function(coords){
			  // {"ip":"xxx","country_code":"RU","country_name":"Россия","region_code":"KDA","region_name":"Краснодарский край","city":"Краснодар","zip_code":"350000","time_zone":"Europe/Moscow","latitude":45.11,"longitude":38.99,"metro_code":0}
			  repoData.coords.lng = coords.longitude;
			  repoData.coords.lat = coords.latitude;

			  // send coords to  next handler
			  return repoData.coords;
			});
	  	}
	  },
      retrieveFromDevice: function(){
		// right now supported only static places
		// no need to calc every time, when a user updates a map
		if (repoData.coords.lng && repoData.coords.lat){
		  return $q.when(repoData.coords);
		}
		else {
		  
		  // get from device or IP
		  return geolocFactory.getCurCoords()
			.then(function(coords){
			  // 43.6078976
              // 39.744629859
			  repoData.coords.lat = coords.latitude;
			  repoData.coords.lng = coords.longitude;
			  // send coords to  next handler
			  return repoData.coords;
			});
		}
      }
    };
  };
  
  angular.module('myApp.locRepo', [
    'myApp.geolocFactory'
    // 'myApp.hprFactory'
  ])

    .factory('locRepo', [
      '$q',
      'geolocFactory',
      // 'hprFactory',
      xpo]);
  
})(window.angular);
