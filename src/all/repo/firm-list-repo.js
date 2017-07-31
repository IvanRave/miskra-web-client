(function(angular){
  'use strict';

  /**
   */
  var xpo = function($q, firmListFactory){

	// prev: map_data
	var repoData = {
      result: {},
      total: 0
	};

	// Translate from service group name to 2gis name
	var groupTranslation = {
      hair: {
		name: "Парикмахерские"
      },
      lashes: {
		name: "Услуги по уходу за ресницами / бровями"
      },
      nail: {
		name: 'Ногтевые студии'
      },
      makeup: {
		name: 'Услуги визажиста'
      }
	};
	
	var prevData = {};
	
    return {
      getData: function(){
		return repoData;
      },
      retrieveData: function(lng, lat, servGroupId){
		// do not load data if already loaded
		if (lng === prevData.lng &&
			lat === prevData.lat &&
			servGroupId === prevData.servGroupId){

		  return $q.when(repoData);
		}

		if (!groupTranslation[servGroupId]){
		  return $q.reject(new Error('noSuchSpec: ' + servGroupId));
		}
		
		//  bound%5Bpoint1%5D=37.432,55.836
		// &bound%5Bpoint2%5D=37.633,55.637
		// zoom=14 ~ 6km for big screen and 3 for small
		return firmListFactory
		  .loadFirmsByPoint(groupTranslation[servGroupId].name,
							lng, lat, 3000)
		/**
		 * r - { total: 123, markers: []}
		 * total numbers of companies in current radius and city
		 */ 
          .then(function(r){
			repoData.result = r.result;
			repoData.total = r.total;
			
			prevData.lng = lng;
			prevData.lat = lat;
			prevData.servGroupId = servGroupId;

			return repoData;
		  });
      }
    };

  };
  
  angular.module('myApp.firmListRepo',[
    'myApp.firmListFactory'
  ])
    .factory('firmListRepo', [
	  '$q',
      'firmListFactory',
      xpo
    ]);
  
})(window.angular);
