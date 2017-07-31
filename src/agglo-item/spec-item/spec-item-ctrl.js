(function(angular) {
  'use strict';
  
  // it is intermediate layer: redirect to /services?by=xxx
  var xpo = function($scope,
					 $q,
					 $timeout,
					 readiness,
					 hprFactory,
					 servGroupRepo,
					 q_agglo_local_name,
					 q_spec_name){
	
	// Titles are limited to 512 total characters in internet explorer according to MSDN.
	// site+ city+ specItem
	// console.log('spec_item', q_spec_name, q_agglo_local_name);
	
    // already checked possible values in a resolve function

    // select between
    // ?by=master
    // ?by=salon

	//   /**
    //    * Current serv group (spec)
    //    * @type {Object}
    //    */

    //   // html here is not ready: if an address url contains
    //   //   this two links
    //   // if no links in an address url
    //   //   show two links:
    //   // /services?by=master
    //   // /salons
    // };

    // variant: load only one rubric (with statistic) by name
    servGroupRepo.retrieveData()
      .then(function(arr){
		// $scope.arr_serv_group = r.arr_serv_group;
		// load child views
		
		// this property is independent of rubric_arr
		// and may be retrieved using own request: /rubrics/:name
		var curSpec = hprFactory.findElemByProp(
		  arr || [],
		  'name',
		  q_spec_name);

		if (curSpec){
		  $scope.cur_spec = curSpec;		  
		  // readiness -> in nested views
		} else {
		  $scope.err_cur_spec = {
			msg: `Специализация "${q_spec_name}" в городе ${$scope.cur_agglo.local_name} не найдена`
		  };
		  
		  readiness.notFound();		  
		}
	  })
      .catch(function(reason) {
		$scope.err_cur_spec = {
		  msg: 'Ошибка загрузки специализации. Пожалуйста, попробуйте позже',
		  reason: reason
		};

		console.log('retrieveData', reason);
		readiness.serverError(new Error(reason));
      });

    // unselect a group - redirect back
    // show it with 500ms delay
    $timeout(function(){      
      $scope.is_prg = true;
    }, 500);
  };
  
  angular.module('myApp.SpecItemController', [
	'myApp.hprFactory',
    'myApp.servGroupRepo',
	'myApp.readiness'
  ])

    .controller('SpecItemController', [
      '$scope',
	  '$q',
      '$timeout',
	  'readiness',
	  'hprFactory',
      'servGroupRepo',
	  'q_agglo_local_name',
      'q_spec_name',
      xpo
    ]);
  
})(window.angular);
