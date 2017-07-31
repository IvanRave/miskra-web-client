/**
 * http://api.2gis.ru/doc/firms/searches/search
 * bound[point1]=37.432,55.836&bound[point2]=37.633,55.637
 * в системе координат WGS84.
 * bound: {p1: 123, p2: 2334} translates to (using $http)
 * "URL:http://ya.ru/?bound={"point1":"123","point2":"234"}&some=val"
 * http://catalog.api.2gis.ru/search?key=rucgsg0683&version=1.3&what=%D0%9F%D0%B0%D1%80%D0%B8%D0%BA%D0%BC%D0%B0%D1%85%D0%B5%D1%80&bound%5Bpoint1%5D=37.432,55.836&bound%5Bpoint2%5D=37.633,55.637
 */

(function(angular, APPCONF) {
  'use strict';

  var xpo = function($http, $q) {

    var gis_params = {
      key: APPCONF.APICOM_KEY,
      version: APPCONF.APICOM_VERSION,
      sort: 'distance',
      page: 1,
      // Количество результатов поиска, выводимых на одной странице
      // Значение по умолчанию: 20. Ограничение: от 5 до 50.
      // http://api.2gis.ru/doc/firms/searches/search/
      // Usually a page contains nearest 50's objects
      // Do not load companies, if zoom < 14 - nothing to show
      pagesize: 50,
      what: '',
      'stat[user]': APPCONF.XUID,
      'stat[sid]': APPCONF.XSID
    };
    
    var cbkReq = function(r) {
      if (r.status !== 200) {
        return $q.reject('Ошибка запроса');
      }

      if (!r.data) {
        return $q.reject('Ошибка запроса');
      }

      //http://api.2gis.ru/doc/firms/response-codes#responses
      if (r.data.response_code === '404') {
        return {
          total: 0,
          markers: []
        };
      }

      if (r.data.response_code !== '200') {
        return $q.reject('Ошибка запроса');
      }

      return {
        total: parseInt(r.data.total, 10),
        result: r.data.result
      };
    };

    // radius by default = 250 meters, max: 40km, min: 1m
    var loadFirmsByPoint = function(rubricName,
				    lon1,
				    lat1,
				    radius) {
      
      gis_params['what'] = rubricName;
      gis_params['point'] = lon1.toString() +
	',' + lat1.toString();
      gis_params['radius'] = radius;

      return $http({
        method: 'GET',
        url: APPCONF.APICOM_ENDPOINT + '/search',
        params: gis_params
      }).then(cbkReq);
    };

    return {
      // loadFirmsByBound: loadFirmsByBound,
      loadFirmsByPoint: loadFirmsByPoint
    };
  };

  angular.module('myApp.firmListFactory', [])

    .factory('firmListFactory', [
	  '$http',
	  '$q',				
	  xpo
	]);

}(window.angular, window.APPCONF));

// /**
// * Convert GIS item to GeoJSON
// */
// var itemToMarker = function(item) {
//   return {
//     lat: parseFloat(item.lat),
//     lng: parseFloat(item.lon),
//     message: '<div style="background: yellow">' + item.name + '</div>'
//     // message: item.name,
//     // click: function() {
//     //   alert('asdf');
//     // }
//   };
// };

// e.g.: bound coords: 37.432, 55.836, 37.633, 55.637
// var loadFirmsByBound = function(rubricName, lon1, lat1, lon2, lat2) {
//   gis_params['bound[point1]'] = lon1.toString() + ',' + lat1.toString();
//   gis_params['bound[point2]'] = lon2.toString() + ',' + lat2.toString();
//   gis_params['what'] = rubricName;

