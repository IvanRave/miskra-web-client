(function(angular) {
  'use strict';

  var repoData = {};
  
  var xpo = function($q, apimas, geoHelper){
	var handleAgglo = function(aggloItem){	  
	  // save to cache
	  repoData[aggloItem.local_name] = aggloItem;
	  
	  return aggloItem;
	};
	
	var retrieveByLocalName = function(localName){
	  if (repoData[localName]){
		return $q.when(repoData[localName]);
	  }

	  // returns entire object
	  // - center (for a map)
	  // - regions and districts (for categories and filter)
	  // - tags (aliases - to use in text)
	  return apimas.sendGet('/territory/get-agglo-by-local-name', {
		local_name: localName
	  })
		.then(handleAgglo);
	};

	var retrieveById = function(id){
	  var tmpAgglo;

	  for (var ky in repoData){
		if (repoData[ky].id === id) {
		  tmpAgglo = repoData[ky];
		}
	  }

	  // load from cache
	  if (tmpAgglo) {
		return $q.when(tmpAgglo);
	  }

	  return apimas.sendGet('/territory/get-agglo-by-id', {
		id: id
	  })
		.then(handleAgglo);
	};

	var retrieveByCoords = function(lng, lat){
	  // try to find in cache
	  var arrAgglo = [];

	  for (var ky in repoData){
		arrAgglo.push(repoData[ky]);
	  }
	 
	  var tmpAgglo = geoHelper.findAggloByCoords(arrAgglo, lat, lng);

	  if (tmpAgglo){
		return $q.when(tmpAgglo);
	  }

	  // find in DB
	  return apimas.sendGet('/territory/get-agglo-by-coords', {
		ll: lng + ',' + lat
	  })
		.then(handleAgglo);
	};
	
	return {
	  retrieveByLocalName: retrieveByLocalName,
	  retrieveByCoords: retrieveByCoords,
	  retrieveById: retrieveById
	};
  };
  
  angular.module('myApp.aggloItemRepo', [
	'myApp.apimas',
	'myApp.geoHelper'
  ])

    .factory('aggloItemRepo', [
	  '$q',
	  'apimas',
	  'geoHelper',
      xpo
    ]);

}(window.angular));

// if (localName){
// 	if (localName !== 'Краснодар'){
// 	  return $q.reject({
// 		status: 404
// 	  });
// 	}

// 	return $q.when({
// 	  "id":23,
// 	  "inter_code":"krasnodar",
// 	  "local_name":"Краснодар",
// 	  "extent":"POLYGON((38.650082533080614 45.265381527628314,39.378568391258518 45.265290155888565,39.376447901540722 44.943555640357872,38.652042547509957 44.943645998476249,38.650082533080614 45.265381527628314))",
// 	  "centroid":"POINT(38.970325562475452 45.024565047103778)",
// 	  "geo_id":"3237387433934850",
// 	  "country_id":"ru",
// 	  "locale_id":"ru",
// 	  "tag1":null,
// 	  "tag2":null
// 	});
// }
