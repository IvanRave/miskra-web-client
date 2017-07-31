// ?Как выбирать станции метро для установки адреса приёма
// Ближайшее метро (авито)
// Если нет метро - то просто не указывать (указывать только адрес)

(function(angular){
  'use strict';

  var repoData = {
	arr_geo_region: [],
	is_loaded: false
  };
  
  var xpo = function($q, ArrGeoRegion){
    var setData = function(arr_geo_region) {
      // remove all prev elements
      repoData.arr_geo_region.length = 0;
      // add new elements
      // rearrange agglos: first msk ans spb
      
      angular.extend(repoData.arr_geo_region,
					 arr_geo_region);
      // data = tmpData - break current references
      repoData.is_loaded = true;
    };
	
	return {
	  getData: function(){
		return repoData;
	  },
      retrieveData: function() {
		// console.log('try: retrieving agglos');
		// if already loaded: do not load

		if (repoData.is_loaded){
		  return $q.when(repoData.arr_geo_region);
		  // dfr.resolve();
		  // return dfr.promise;
		}
		else {

		  ////repoData.is_loaded = false;

		  // var req = {
		  // 	method: "GET",
		  // 	url: APPCONF.APIMAS_ENDPOINT + "/territory/get-agglos"
		  // };
		  
		  // return $http(req).then(setData);

		  setData(ArrGeoRegion.arr_geo_region);
		  return $q.when(ArrGeoRegion.arr_geo_region);
		}
      },
	  
	  isStations: function(rid){
		if (!repoData[rid]){
		  return false;
		}

		var stations = repoData[rid].stations;
		if (stations && stations.length > 0){
		  return true;
		} else {
		  return false;
		}
	  }
	};
  };
  
  angular.module('myApp.geoRegionRepo', [
	'myApp.ArrGeoRegion'
  ])

	.factory('geoRegionRepo', [
	  '$q',
	  'ArrGeoRegion',
	  xpo]);
})(window.angular);
