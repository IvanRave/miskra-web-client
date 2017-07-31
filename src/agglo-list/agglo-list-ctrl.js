(function(angular){
  'use strict';

  /**
   * A list with cities (manual selection)
   */
  var xpo = function($scope,
					 $state,
					 readiness,
					 geoAggloRepo){

	var ttl = 'Выбор города';

	$scope.page_ttl = ttl;

	//console.log('agglo list controller');
    // translate agglo_repo to $scope

	var cbkCatch = function(tmpError) {
	  $scope.agglo_err = {
		msg: 'Технические неполадки: не удалось подключиться к серверу.'
	  };
	  // title is not important for crawlers: it is an error
	  readiness.serverError(tmpError);
	  console.log('aggloRetrieveError', tmpError);
	};

    // Load all cities (if not yet loaded)
	// only next params { local_name, id, center, region - to build a map
	//console.log('retrieve all agglos');
    geoAggloRepo.retrieveData()
      .then(function(arrGeoAgglo){
		$scope.arr_geo_agglo = arrGeoAgglo;
		// in title or description: list of large cities

		var canonicalPath = $state.href("byt.aggloList");

		readiness.ok(ttl,
					 'Указание необходимого города из списка: Москва, Санкт-Петербург, Новосибирск, Алматы, Екатеринбург, Нижний Новгород, Казань, Челябинск, Омск, Самара и другие города', canonicalPath);
	  })
      .catch(cbkCatch);
  };

  angular.module('myApp.AggloListController', [
    'myApp.geoAggloRepo',
	'myApp.readiness'
  ])

    .controller('AggloListController', [
      '$scope',
      '$state',
	  'readiness',
      'geoAggloRepo',
      xpo
    ]);

})(window.angular);

/* Alternative: modal
 * Open a modal window with agglo selection
 *   it might be simple list or a map (vNext)
 *   open, even agglos are not loaded yet
 *   will be attached later to opened window
 * Close modal window with agglo selector
 */
