/**
 * List of suppliers (for tbl view)
 */
(function(angular){

  'use strict';

  var repoData = {
	arr_supplier: []
  };
  
  var xpo = function($q,
					 $window,
					 apimas){
	var cleanArr = function(){
      repoData.arr_supplier.length = 0;
	};

    var addData = function(arr_master_detail) {
	  
	  // arr_supplier === arr_master_detail
      angular.forEach(arr_master_detail, function(spl) {
		spl.arr_serv_work = [];
		spl.arr_master_serv = [];
		repoData.arr_supplier.push(spl);
      });	 
    };

	// var attachWorks = function(arr_table_work){
	//   angular.forEach(repoData.arr_supplier, function(spl){
	// 	var tmpArr = [];
	// 	angular.forEach(arr_table_work, function(wrk){
	// 	  if (spl.id === wrk.master_profile_id){
	// 		tmpArr.push(wrk);
	// 	  }
	// 	});
	// 	if (tmpArr.length > 0){
	// 	  spl.arr_serv_work = tmpArr;
	// 	}
	//   });
	// };

	// var portionStep = 10;
	// // with 50-step
	// // ids: master ids
	// var rtvPortion = function(ids, serv_rubric_id, ind){
	//   var idsPortion = ids.slice(ind, ind + portionStep);

	//   if (idsPortion.length > 0){
		
	// 	apimas.sendGet("/work/get-by-masters", {
	// 	  ids_master_profile: idsPortion.join('__'),
	// 	  serv_rubric_id: serv_rubric_id
	// 	}).then(function(result){
	// 	  attachWorks(result.arr_table_work);
	// 	  rtvPortion(ids, serv_rubric_id, ind + portionStep);
	// 	});
	//   }
	// };
	
	// var retrieveWorks = function(arr_master_detail, serv_rubric_id){
	//   var ids = arr_master_detail.map(function(v){
	// 	return v.id;
	//   });

	//   rtvPortion(ids, serv_rubric_id, 0);
	// };


	var retrieveByRubric = function(servBlaId,
									geoDistrictId,
									reqName,
									limit){

	  var params = {
		serv_rubric_id: servBlaId,
		geo_district_id: geoDistrictId
	  };

	  if (reqName) {
		params.req_name = reqName;
	  }

	  if (limit){
		params.limit = limit;
	  }
	  
	  return apimas.sendGet("/master/get-by-rubric", params)
		.then(function(result){
		  var arr = result.arr_master_detail;
		  if (!arr){ 
			return $q.reject('no arr_master_detail');
		  }
		  // show first 99 (use reqParam:limit for this purpose)
		  //arr = arr.slice(0, 99);
		  cleanArr();
		  addData(arr);
		  //retrieveWorks(arr, servBlaId);
		  return arr;
		});	 
	};

	return {
	  // only one repo array for group/rubric/agglo
	  //	  retrieveByGroup: retrieveByGroup,
	  retrieveByRubric: retrieveByRubric,
	  // retrieveByAgglo: retrieveByAgglo,
	  // to refresh data - use internal methods:
	  //    like: refreshByGroup
	  //    this method included in 'retrive' methods
	  
	  // clean it during new view processing
	  cleanArrSupplier: cleanArr
	};
  };

  angular.module('myApp.supListRepo', [
	'myApp.apimas'
  ])

	.factory('supListRepo', [
	  '$q',
	  '$window',
	  'apimas',
	  xpo]);

})(window.angular);
