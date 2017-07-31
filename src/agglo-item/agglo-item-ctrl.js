// aggloItemRoute loads agglo itself only
//   no array of children, like specList or rubricList

// #!/cities/spb/specs/hair
//   show links to servicesByMaster and servicesBySalon
//   usually this page skipped (select 'hair' + 'by' together)
// #!/cities/spb/specs/hair/services
//    ?by=master&rubrics=hairExt,hairCut
// #!/cities/spb/specs/hair/services
//    ?by=salon
// if (!by) redirect to #!/cities/spb/specs (to select again)
// if (rubrics.length === 0) show nothing
//    usually only one rubric - selected
//    if few rubrics are selected - re-load a state every time
(function(angular){
  'use strict';

  var xpo = function($scope,
					 $timeout,
					 $state,
					 readiness,
					 aggloItemRepo,
					 q_agglo_local_name){
    /**
     * Selected agglomeration:
     *   calculated from url state
     *   only works in this view
     *   retrieve agglomerations if not exists (update a page)
     *   or show this view if all agglos are retrieved
     */

	//console.log('loaded agglo item', q_agglo_local_name);

    var handleAgglo = function(tmpAgglo){

      // Redirect to list: if no such city
      // In a list view: try auto-recognition

	  $scope.cur_agglo = tmpAgglo;
	  $scope.home_href = $state.href('byt.aggloItem.specList', {
		agglo_local_name: tmpAgglo.local_name
	  });

	  // readiness -> in nested views
	  // redirect to specList: download rubrics
    };

	var handleErr = function(tmpError) {
	  if (tmpError.status === 404){
		$scope.err_cur_agglo = {
		  msg: `Город ${q_agglo_local_name} не найден`
		};
		// todo: show error message
		readiness.notFound();
		return;
	  }

	  console.log('aggloRetrieveError');
	  console.log(tmpError);
	  $scope.err_cur_agglo = {
		msg: 'Технические неполадки: не удалось подключиться к серверу'
	  };
	  readiness.serverError(tmpError);
	};

    // Load agglos, then load geo location
    // TODO: download only selected city with addt info
    //       using q_agglo_id or q_agglo_local_name
	// console.log('retrieve agglo if not yet loaded');
	// or just inject it to a client
	// aggloItemRepo.retrieveByLocalName(local_name)
	// returns city with details
	aggloItemRepo.retrieveByLocalName(q_agglo_local_name)
      .then(handleAgglo)
      .catch(handleErr);

    // show it with 500ms delay
    $timeout(function(){
      $scope.is_prg = true;
    }, 500);
  };

  angular.module('myApp.AggloItemController', [
	'myApp.aggloItemRepo',
	'myApp.readiness'
  ])

    .controller('AggloItemController', [
      '$scope',
      '$timeout',
      '$state',
	  'readiness',
	  'aggloItemRepo',
      'q_agglo_local_name',
      xpo]);

})(window.angular);
