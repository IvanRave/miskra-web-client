// Retrieve master profile (from Insta)
(function(angular) {
  'use strict';

  // {"id":115556,
  //  "name":"somdsfsdf",
  //  "main_phone":"+234234",
  //  "main_email":null,
  //  "modified":1420059600,
  //  "created":1420059600,
  //  "is_verified":false,"is_active":false,
  //  "exp_entire":null,"exp_private":null,
  //  "gender":null,
  //  "lname":null,"fname":null,"mname":null,
  //  "avatar":null,
  //  "master_address":{
  //    "master_profile_id":115556,
  //    "geo_district_id":32,
  //    "description":"asdfasdf",
  //    "coords":null}};
  
  var xpo = function($q, apimas){

	var endpoint = '/master/get-profile';
    /**
     * Retrieve master detail, like address, email, etc
     * @param {Stirng|Number} id
     */
    var retrieveData = function(id){

      // clean prev master, if exists
      // send id of a master
      // return mp + all services + all works	  
      // + contacts + address

	  var url_params = {
		id: id	
	  };

	  return apimas.sendGet(endpoint, url_params);
    };
    
    return {
	  // may be cached
      retrieveData: retrieveData
    };
  };
  
  angular.module('myApp.supItemRepo', [
	'myApp.apimas'
  ])

    .factory('supItemRepo', [
	  '$q',
	  'apimas',							 
	  xpo
	]);
  
})(window.angular);
