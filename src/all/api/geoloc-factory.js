/**
 * By default, getCurrentPosition() tries to answer as fast as possible 
 * with a low accuracy result. It is useful if you need a quick answer 
 * regardless of the accuracy. Devices with a GPS, for example, 
 * can take a minute or more to get a GPS fix, 
 * so less accurate data (IP location or wifi) 
 * may be returned to getCurrentPosition().
 */

(function(angular, APPCONF) {
  'use strict';

  var xpo = function($q, $http, $timeout) {
	
    var getByIp = function() {

	  var url = APPCONF.GEO_ENDPOINT;

	  // for dev, desktop and mobile apps
	  if (!url){
		//dfr.reject('no');
		//var dfr = $q.defer();
		return $timeout(function(){
		  // todo: dev
		  return {
			latitude: 55.75,
			longitude: 37.6,
			accuracy: 100000
		  };
		}, 500);	
		
	  } else {
		return $http({
		  method: 'GET',
		  url: url
		}).then(function(r) { // status, config
		  //alert(JSON.stringify(ipCoords));

		  if (!r.data){
			return $q.reject(new Error('no data'));
		  }

		  var dta = r.data.Data;

		  if (!dta){
			return $q.reject(new Error('no Data'));
		  }		  
		 
		  var lctn = dta.Location;

		  if (!lctn){
			return $q.reject(new Error('no Location'));
		  }
		  
		  return {
			latitude: lctn.Latitude,
			longitude: lctn.Longitude,
			// city: ipCoords.city, usually it is undefined
			accuracy: 100000 // 100km
		  };
		});
	  }
    };
	
    var getCurCoords = function() {
      var dfr = $q.defer();
      // at this moment only ip
      // tryToIp(dfr);
      // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
          dfr.resolve(position.coords);
        }, function(err) {
          //tryToIp(dfr);
          console.log('geoloc error', err);
          dfr.reject('Не удалось получить текущее местоположение');
        }, {
          timeout: 10000 // 2sec - too many for mobile devices in some cases
        });
      }
      else {
        // tryToIp(dfr);
        // $log.log('geoloc error', 'geolocation is not found in navigator');
        dfr.reject('Не удалось получить текущее местоположение');
      }

      // TODO: //lfl.GeoIP.centerMapOnPosition(map, 15);
      return dfr.promise;
    };

    return {
      getCurCoords: getCurCoords,
	  getByIp: getByIp
    };
  };


  angular.module('myApp.geolocFactory', [])

    .factory('geolocFactory', [
      '$q',
      '$http',
	  '$timeout',
      xpo]);

}(window.angular, window.APPCONF));

// var p = {
//   "ip": "",
//   "country_code": "RU",
//   "country_name": "Russia",
//   "region_code": "",
//   "region_name": "",
//   "city": "",
//   "zip_code": "",
//   "time_zone": "Europe/Moscow",
//   "latitude": 123,
//   "longitude": 123.234,
//   "metro_code": 0
// };
