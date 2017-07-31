(function(angular){
  'use strict';

  var repoData = {
	arr_prtf_work: [],
	is_loaded: false
  };
  
  var xpo = function($q, apimas){

	var setData = function(arrServer) {
	  repoData.arr_prtf_work.length = 0;
	  
      angular.forEach(arrServer, function(v) {
		repoData.arr_prtf_work.push(v);
      });
	  
	  repoData.is_loaded = true;
	};
	
    /**
     * Retrieve array of work (portfolio view)
     * @param {Number} geoDistrictId
	 * @param {String} servRubricId
     */
    var retrieveData = function(servRubricId,
								geoDistrictId){
      // clean prev master, if exists
      // send id of a master
      // return mp + all services + all works	  
      // + contacts + address      

	  return apimas.sendGet('/work/get-portfolio', {
		geo_district_id: geoDistrictId,
		serv_rubric_id: servRubricId
	  }).then(function(r){
		// shuffle( - from hprFactory
		var smashArr = r.arr_prtf_work.slice(0, 99);
		// todo: move smash and slice methods to server side
		setData(smashArr);
		//return r.data;
		return smashArr;
      });
    };	
    
    return {
      retrieveData: retrieveData
    };
  };
  
  angular.module('myApp.prtfRepo', [
	'myApp.apimas'
  ])
	.factory('prtfRepo', [
	  '$q',
	  'apimas',							 
	  xpo
	]);  

})(window.angular);
