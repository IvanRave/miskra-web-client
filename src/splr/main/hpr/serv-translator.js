(function(angular){
  'use strict';

  var xpo = function(servGroupRepo){
	
	// add translation to array
	var translate = function(arr_master_serv){
	  
  	  var successLoadGroups = function(arr_serv_group){
  		//var rubricNameObj = {};
		var groupNameObj = {};
		
  		angular.forEach(arr_serv_group, function(grp){
  		  //angular.forEach(grp.arr_serv_rubric, function(rbr){
  		  // rubricNameObj[rbr.id] = rbr.name;
		  groupNameObj[grp.id] = grp.name;
  		  // });
  		});

  		angular.forEach(arr_master_serv, function(msrv){
		  // from a request
  		  // msrv.serv_rubric_name = capitalizeFirst(msrv.serv_rubric_name);
  		  // 	rubricNameObj[msrv.serv_rubric_id];
		  msrv.serv_group_name =
			groupNameObj[msrv.serv_group_id];
			
  		});

		// return translated array
		return arr_master_serv;
  	  };
	  
  	  // load all rubrics with names
	  // loaded already - if from a catalog of masters
	  // non-loaded - if from search engine or direct (update)
  	  return servGroupRepo.retrieveData()
  		.then(successLoadGroups);
	};
	
	return {
	  translate: translate
	};
  };
  
  angular.module('myApp.servTranslator', [
	'myApp.servGroupRepo'
  ])
	.factory('servTranslator', [
	  'servGroupRepo',
	  xpo
	]);
  
})(window.angular);
