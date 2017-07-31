(function(angular, APPCONF) {
  'use strict';

  var xpo = function($http, $q) {

    var gis_params = {
      key: APPCONF.APICOM_KEY,
      version: APPCONF.APICOM_VERSION,
      'stat[user]': APPCONF.XUID,
      'stat[sid]': APPCONF.XSID
      // id
      // hash
    };

    var cbkReq = function(data) {

	  // handle in catch
      // if (r.status !== 200) {
      //   return $q.reject('Ошибка запроса');
      // }
      
      // if (!r.data) {
      //   return $q.reject('Ошибка запроса');
      // }
      
      //var dfr = $q.defer();
      //http://api.2gis.ru/doc/firms/response-codes#responses
      if (data.response_code === '404') {
        return $q.reject({
		  status: 404
		});
        // dfr.resolve(null);
        // return;
        // //return null;
      }

      if (data.response_code !== '200') {
        return $q.reject({
		  status: 500
		});
		//$q.reject('Ошибка при получении информации о салоне');
      }

      // if success - register a view
      // at this moment only for an index.html page
      if (window.DG) {
		window.DG.apitracker.regBC(data.register_bc_url);
      }
      
      return data;
    };

    //http://api.2gis.ru/doc/firms/profiles/profile/
    var loadFirm = function(id, hash) {
      gis_params['id'] = id;
      gis_params['hash'] = hash;

// URL:http://catalog.api.2gis.ru/2.0/catalog/branch/get?id=70000001017182335_785r64G6G5IH4H0J3HH1vb42fjn4B67A6I3548382uvhy7062B577G788BA185tk959G44GI0G635924HJec&see_also_size=4&fields=items.adm_div%2Citems.region_id%2Citems.reviews%2Citems.point%2Citems.links%2Citems.name_ex%2Citems.org%2Citems.see_also%2Citems.dates%2Citems.external_content%2Citems.flags%2Citems.ads.options%2Citems.email_for_sending.allowed%2Chash%2Csearch_attributes&key=ruewin2963
	  
      return $http({
        method: 'GET',
        url: APPCONF.APICOM_ENDPOINT + '/profile',
        params: gis_params
      }).then(r => r.data)
		.then(cbkReq);
    };

    return {
      loadFirm: loadFirm
    };

  };

  angular.module('myApp.firmItemFactory', [])

    .factory('firmItemFactory', [
      '$http',
      '$q',
      xpo
    ]);

}(window.angular, window.APPCONF));
