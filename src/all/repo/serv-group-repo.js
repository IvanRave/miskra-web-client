(function(angular) { 
  'use strict';

  var repoData = {
	arr_serv_group: [{
	  "id":"hair",
	  "serv_area_id":"beauty",
	  "lang":"ru",
	  "name":"Парикмахер",
	  "description":null,
	  "tag1":null,
	  "tag2":null
	},{
	  "id":"nail",
	  "serv_area_id":"beauty",
	  "lang":"ru",
	  "name":"Ногти",
	  "description":null,
	  "tag1":null,
	  "tag2":null
	},{
	  "id":"lashes",
	  "serv_area_id":"beauty",
	  "lang":"ru",
	  "name":"Ресницы",
	  "description":null,
	  "tag1":null,
	  "tag2":null
	},{
	  "id":"makeup",
	  "serv_area_id":"beauty",
	  "lang":"ru",
	  "name":"Визажист",
	  "description":null,
	  "tag1":null,
	  "tag2":null
	}]
  };
  
  var xpo = function($q, apimas){
	var retrieveData = function(){
	  // imitation of request
	  return $q.when(repoData.arr_serv_group);
	};

	var makeIds = function(arr){
	  return arr.map(item => item.id);
	};

	var loadScope = function(ids){
	  return apimas.sendGet('/rubric/get-groups', {
		ids: ids.join('__'),
		lang: 'ru'
	  });
	};

	var combineArr = function(arrScope){
	  console.log('combine', arrScope);
	  repoData.arr_serv_group.forEach(function(item) {
		arrScope.forEach(function(itemScope){
		  if (itemScope.id === item.id){
			item.arr_serv_rubric = itemScope.arr_serv_rubric;
		  }
		});
	  });

	  return repoData.arr_serv_group;
	};

	var retrieveWithRubrics = function(){	  
	  	return retrieveData()
	  	.then(arr => makeIds(arr))
		.then(ids => loadScope(ids))
		.then(r => combineArr(r.arr_serv_group));
	};
	
	return {
	  retrieveData: retrieveData,
	  retrieveWithRubrics: retrieveWithRubrics
	};
  };
  
  angular.module('myApp.servGroupRepo', [
	'myApp.apimas'
  ])

    .factory('servGroupRepo', [
      '$q',
	  'apimas',
      xpo
    ]);

}(window.angular));
