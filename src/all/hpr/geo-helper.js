(function(angular) {
  'use strict';

  /**
   * From WKT string to arr of coords
   *      use right order of polygon
   * @param {String} wktString - POLYGON((...))
   * @returns {Array}
   * [{latitude: 51.50, longitude: 7.40},
   * {latitude: 51.555, longitude: 7.40},
   * {latitude: 51.555, longitude: 7.625},
   * {latitude: 51.5125, longitude: 7.625} ]
   */
  var convertWktToArr = function(wkt) {
    // skip POLYGON((..))
    wkt = wkt.substr(9, wkt.length - 11);
    var arrWkt = wkt.split(',');
    return arrWkt.map(function(item) {
      return {
		lng: parseFloat(item.split(' ')[0]),
        lat: parseFloat(item.split(' ')[1])
      };
    });
  };

  var getRegionsByCity = function(arrGeoRegion, cityId){

	var needCity = arrGeoRegion.filter(function(item){
	  return item.city === cityId;
	})[0];
	
	if (!needCity){
	  return [];
	}

	var stations = needCity.stations;
	if (stations && stations.length > 0){
	  return stations.map(function(stn){
		return {
		  id: stn[0],
		  name: stn[1]
		};
	  });
	}

	var districts = needCity.districts;

	if (districts && districts.length > 0){
	  return districts.map(function(stn){
		return {
		  id: stn[0],
		  name: stn[1]
		};
	  });
	}

	return [];	
  };	

  var xpo = function() {

	// https://github.com/manuelbieh/Geolib/blob/master/src/geolib.js
	/**
     * Checks whether a point is inside of a polygon or not.
     * Note that the polygon coords must be in correct order!
     *
     * @param        object      coordinate to check e.g. {latitude: 51.5023, longitude: 7.3815}
     * @param        array       array with coords e.g. [{latitude: 51.5143, longitude: 7.4138}, {latitude: 123, longitude: 123}, ...]
     * @return       bool        true if the coordinate is inside the given polygon
	 */
	var isPointInside = function(pnt, coords) {
	  var c = false;
	  
	  //for(var i = -1, l = coords.length, j = l - 1; ++i < l; j = i) {
	  for (var i = 0, l = coords.length, j = l - 1; i < l; i += 1) {
		if(
		  (
			(coords[i].lng <= pnt.lng && pnt.lng < coords[j].lng) ||
			  (coords[j].lng <= pnt.lng && pnt.lng < coords[i].lng)
		  ) &&
			(
			  pnt.lat < (coords[j].lat - coords[i].lat) *
				(pnt.lng - coords[i].lng) /
				(coords[j].lng - coords[i].lng) + coords[i].lat)
		) {
		  c = !c;
		}
		
		j = i;
	  }

	  return c;
	};
	
    /**
     * Whether the coords in some polygon (in WKT format string)
     * @param {Stirng} wkt - string
     *        POLYGON((76.725995552456567 43.469106272843845,77.108400310397244
     *        43.462692429549705,77.096182318096027 43.108051229816695,
     *        76.715990607945855 43.114386539985126,
     *        76.725995552456567 43.469106272843845))
     */
    var isPointInsideWkt = function(wkt, lat, lng) {
      return isPointInside({
		lng: lng,
		lat: lat
      }, convertWktToArr(wkt));
    };
    
    var findAggloByCoords = function(arrAgglo, latitude, longitude) {
      // if (!aggloCode) {
      //   return null;
      // }
      // aggloCode = aggloCode.toLowerCase();
      var result;

      // item.actual_extent = wkt coordinates polygone
      angular.forEach(arrAgglo, function(item) {
        // http://stackoverflow.com/questions/13843972/angular-js-break-foreach
        if (!result) {
          if (isPointInsideWkt(item.extent, latitude, longitude)) {
            result = item;
            // if (val.code === aggloCode) {
            //   result = val;
            // }
          }
        }
      });

      return result;
    };

    return {
      isPointInsideWkt: isPointInsideWkt,
      findAggloByCoords: findAggloByCoords,
	  getRegionsByCity: getRegionsByCity
    };
  };

  angular.module('myApp.geoHelper', [])

	.factory('geoHelper', [xpo]);

}(window.angular));
