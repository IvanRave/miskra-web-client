(function(angular){
  'use strict';

  class Xpo{
	constructor(
	  $scope,
	  $state,
	  $log,
	  $http,
	  $timeout,
	  readiness,
	  //    accFactory,
	  //    fireFactory,
	  aggloItemRepo,
	  locRepo
	  //    permRepo
	){

	  $scope.page_ttl = 'МисКра';

	  /**
	   * Permission data: stores is_perm_checked switcher
	   */
	  //$scope.perm_data = permRepo.getData();

	  var redirectToAggloSpecs = function(tmpAgglo){
		$state.go('byt.aggloItem.specList', {
		  agglo_local_name: tmpAgglo.local_name
		});
		// a new page has their own ready methods
		// for phantom - no redirect (no session storage)
	  };

	  // Loaded after all agglos is received
	  /**
	   * Calculate agglo from auto-coords
	   *   and redirect to this agglo
	   *   or show error, if an agglo is not supported
	   */
	  var autoCalcAgglo = function(tmpCoords) {

		// Get current auto-coords
		//    Auto-coords can be changed independently of the method
		//    Like a moving car (watch coords)
		//    but update an agglo only by click
		// find a agglo name by coords
		aggloItemRepo.retrieveByCoords(tmpCoords.lng, tmpCoords.lat)
		  .then(function(tmpAgglo){
			if (tmpAgglo){
			  // save only for supported agglomerations
			  //permRepo.saveLocationPermission();
			  redirectToAggloSpecs(tmpAgglo);
			} else {
			  alert("Местоположение не поддерживается сервисом. Попробуйте выбрать вручную.");
			}
		  });
	  };

	  // by click on a button: auto-define
	  $scope.defineLocation = function() {
		locRepo.retrieveFromDevice()
		  .then(autoCalcAgglo)
		  .catch(function(reason) {
			// не удалось получить местоположение
			alert(reason);
		  });
	  };

	  var failCalcAgglo = function(){
		$scope.err_calc = 'не удалось определить автоматически';
	  };

	  var calcAgglo = function(tmpCoords){
		aggloItemRepo.retrieveByCoords(tmpCoords.lng,
									   tmpCoords.lat)
		  .then(function(tmpAgglo){
			if (!tmpAgglo){
			  failCalcAgglo();
			} else {
			  $scope.agglo_calc = tmpAgglo;
			}
		  })
		  .catch(failCalcAgglo);
	  };

	  var tryToAutoDefine = function(){
		locRepo.retrieveByIp()
		  .then(function(coords){
			calcAgglo(coords);
		  })
		  .catch(failCalcAgglo);
	  };

	  var init = function(){
		// values the same as in index files: gulpfile
		readiness.ok('Мастера и салоны красоты',
					 'Парикмахеры, визажисты, уход за ногтями, бровями и ресницами - мастера и салоны красоты России, а также Украины, Казахстана и Белоруссии');

		$scope.is_progress_auto = true;
		tryToAutoDefine();
	  };

	  init();
	}
  }

  angular.module('myApp.WlcController', [
    'ui.router',
	'myApp.aggloItemRepo',
    'myApp.locRepo',
	'myApp.readiness'
  ])

    .controller('WlcController', [
      '$scope',
      '$state',
      '$log',
      '$http',
      '$timeout',
	  'readiness',
	  'aggloItemRepo',
      'locRepo',
      Xpo]);
})(window.angular);
