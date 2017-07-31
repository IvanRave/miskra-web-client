(function(angular) {
  'use strict';

  function rearrangeArr(arr){
    // var moscowIndex, spbIndex,
	// 	novosibirskIndex, krasnodarIndex;

	arr.sort(function(a, b){
	  return (a.local_name > b.local_name) ? 1 : -1;
	});

	var top = [];

	var names = [
	  'moscow',
	  'spb',
	  'novosibirsk',
	  'ekaterinburg',
	  'n_novgorod',
	  'kazan',
	  'chelyabinsk',
	  'omsk'
	];
	
    // length - calculated everystep
    for (var i = 0; i < arr.length; i+=1) {
      var agg = arr[i];

	  for (var k = 0; k < names.length; k+=1){
		if (agg.inter_code === names[k]){
		  top[k] = agg;
		  arr.splice(i--, 1);
		}
	  }
      // if (agg.inter_code === 'moscow'){
	  // 	top[0] = agg;
	  // 	arr.splice(i--, 1);
      // } else if (agg.inter_code === 'spb'){
	  // 	top[1] = agg;
	  // 	arr.splice(i--, 1);
      // } else if (agg.inter_code === 'novosibirsk'){
	  // 	top[2] = agg;
	  // 	arr.splice(i--, 1);
      // } else if (agg.inter_code === 'krasnodar'){
	  // 	top[3] = agg;	 
	  // 	arr.splice(i--, 1);
      // }
    }

	for (var j = top.length - 1; j >= 0; j-=1){
	  arr.splice(0,0,top[j]);
	}	
  }
  
  var repoData = {
    arr_geo_agglo: [],
    // logic of this param: in is_perm_checked param
    is_loaded: false
  };

  var xpo = function($q,
					 apimas) {
	
    var setData = function(arr_geo_agglo) {
      // remove all prev elements
      repoData.arr_geo_agglo.length = 0;
      // add new elements
      // rearrange agglos: first msk ans spb

      var tmpArr = arr_geo_agglo;
			//r.data.arr_geo_agglo;

      rearrangeArr(tmpArr);
      
      // tmpArr.sort(function(a,b){
      // 	if (a.geo_id > b.geo_id){return 1;}
      // 	if (a.geo_id < b.geo_id) {return -1;}
      // 	return 0;
      // });
      
      angular.extend(repoData.arr_geo_agglo,
					 tmpArr);
      // data = tmpData - break current references
      repoData.is_loaded = true;      
    };

	var retrieveData = function() {
	  // console.log('try: retrieving agglos');
	  // if already loaded: do not load

	  if (repoData.is_loaded){
		return $q.when(repoData.arr_geo_agglo);
		// dfr.resolve();
		// return dfr.promise;
	  }
	  else {

		////repoData.is_loaded = false;

		return apimas.sendGet("/territory/get-agglos", {})
		  .then(function(r){
			setData(r.arr_geo_agglo);
			return r.arr_geo_agglo;
		  });		
	  }
    };
	
    return {
      retrieveData: retrieveData
    };
  };

  angular.module('myApp.geoAggloRepo', [
	'myApp.apimas'
  ])

    .factory('geoAggloRepo', [
      '$q',
	  'apimas',
      xpo
    ]);

}(window.angular));
