/**
 * Load rubrics and statistic for groups
 *    hair: ['hairExt', 'hairCut'...] + counters
 */
(function(angular, APPCONF) {
  'use strict';

  // Default data with groups and names
  // In global scope: rubric_repo
  // repoData for each city separatelly
  var repoData = {};

  var xpo = function($q,
					 $http) {


    /**
     * Retrieve serv stat
     */
    var refreshData = function(geoDistrictId, arrServGroup) {
      // load once per geoDistrictId
      // re-load for another session (rare changes of data)
      // re-load for another city

	  var idsServGroup = arrServGroup.map((grp) => grp.id);

      var req = {
	  	method: "GET",
	  	url: APPCONF.APIMAS_ENDPOINT + "/rubric/get-serv-stat",
	  	params: {
		  // 'nail__hair__makeup__lashes'
		  ids_serv_group: idsServGroup.join('__'),
		  lang: 'ru',
		  geo_district_id: geoDistrictId
	  	  //ids: idsServGroup.join('__'),
	  	  //ids_serv_group: idsServGroup.join('__'),
	  	  //lang: lang
	  	}
      };

	  return $http(req);
      // return localReq(lang)  //$http(req)
	  // 	.then(handleResult);
      // catch errors in main code
    };

	var calcGroupName = function(arrServGroup, servGroupId){
	  var curGroup = arrServGroup.filter((grp) => {
		return grp.id === servGroupId;
	  })[0];

	  if (curGroup){
		return curGroup.name;
	  } else {
		console.log('error: calcGroupName: no servGroupId', servGroupId);
		return null;
	  }
	};

	var attachGroupNames = function(arrServRubricStat, arrServGroup){

	  angular.forEach(arrServRubricStat, (rbr) => {
		rbr.serv_group_name = calcGroupName(arrServGroup, rbr.serv_group_id);
	  });
	  console.log('arrSRS', arrServRubricStat);
	};
    
    return {
      //      setData: setData, // read-only repo
      retrieveData: function(geoDistrictId, arrServGroup){
		// lazy loading
		// every getData request may be counted, so
		//   use lazy loading for getData and retrieveData
		var cacheObj = repoData['city' + geoDistrictId];
		
		if (!cacheObj){
		  return refreshData(geoDistrictId, arrServGroup)
			.then(function(r){

			  attachGroupNames(r.data.arr_serv_rubric_stat, arrServGroup);
			  
			  repoData['city' + geoDistrictId] = r.data;
			  return repoData['city' + geoDistrictId];
			});
		} else {		  
		  return $q.when(cacheObj);
		}
	  }
    };
  };

  angular.module('myApp.servStatRepo', [])

    .factory('servStatRepo', [
      '$q',
      '$http',
      xpo
    ]);

}(window.angular, window.APPCONF));

// repoData.arr_serv_group[0].arr_serv_rubric.push({
// 	id: 'supercure',
// 	lang: 'ru',
// 	serv_group_id: "nail",
// 	name: "SuperCure"
// });


//  var setData = function(tmpData) {
// // remove all prev elements
// data.length = 0;
// // add new elements
// angular.extend(data, tmpData);
// // data = tmpData - break current references
//    };


// SELECT counters FROM master mp
// WHERE mp.geo_district_id = geo_district_id
// JOIN master_serv ms
// JOIN serv_rubrics sr
// WHERE sr.serv_group_id ANY serv_group_ids
//   can be changed later to only one serv_group_id
// GROUP by sr.id
// ORDER by COUNT(ms) / per rubric

// this request doesn't touch serv_group table
// and it is better than 5 separate single requests


// from this response: calc counters per serv_group
// serv_group_id | count(rubrics) | count(master_serv)
// this request is the same JOINER, except
// - full list of rubrics, instead count(rubrics) only

// this request is better than
// global counter per serv_group
// - no need to send requests, if serv_group is changed
//   it is possible situation
// - a client can view not only counters,
//   but rubric names
// overflow inner join with rubric names: but
//   it is task of middle-db

// convert from response to our object
// group by serv_group
// do not remove serv_groups:
// clean only arr_serv_rubric
// and add news one
// Add all array at a moment: do not add items separately
//   it might occur an error during double-request   
// var handleResult = function(r){
//   //console.log(r.data);
//   // group by serv_groups
//   repoData.arr_serv_group.length = 0;
//   angular.extend(repoData.arr_serv_group,
// 				 r.data.arr_serv_group);

//   // attach new values (filters)
//   //repoData.geo_district_id = r.data.geo_district_id;
//   //      console.log(repoData);
//   /**
//    * Whether the rubrics are loaded
//    */
//   repoData.is_loaded = true;

//   return repoData;
// };

// var localReq = function(){
//   var dfr = $q.defer();

//   // $timeout(function(){
//   // 	dfr.reject('some error');
//   dfr.resolve({
//   	data: arrRubricFactory
//   });
//   // }, 1000);

//   return dfr.promise;
// };

// var repoData = {
//   arr_serv_group: [],
//   lang: "ru",
//   geo_district_id: null,
// 	//	ids_serv_group: null
//   // load once per app, per city
//   // re-load for another session (rare changes of data)
//   // re-load for another city
//   is_loaded: false
// };
