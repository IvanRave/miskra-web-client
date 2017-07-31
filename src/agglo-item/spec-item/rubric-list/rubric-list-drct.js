(function(angular){
  'use strict';

  class Xpo{
	constructor($scope,
				$timeout,
				$state,
				servGroupRepo,
				servStatRepo,
				readiness){

	  $scope.home_href = $state.href("byt.aggloItem.specList", {
		agglo_local_name: $scope.agglo.local_name
	  });

	  $scope.map_href = $state.href("byt.map",{
		g: $scope.agglo.local_name,
		spec: $scope.spec.id
	  });

	  $scope.calcHref = (rubricName, viewKind) => $state.href("byt.aggloItem.specItem.rubricItem." + viewKind, {
		  agglo_local_name: $scope.agglo.local_name,
		  spec_name: $scope.spec.name,
		  rubric_name: rubricName
	  });

	  var handleReady = function(){
		var canonicalUrl = $state.href("byt.aggloItem.specItem.rubricList", {
		  agglo_local_name: $scope.agglo.local_name,
		  spec_name: $scope.spec.name
		});

		var pageDscr = $scope.spec.name + ' в ' + $scope.agglo.case_prepositional + ' - перечень предоставляемых услуг'; 

		var dscrLength = pageDscr.length;
		var dscrPluses = [];
		angular.forEach($scope.rubrics, (rbr) => {
		  if (dscrLength + rbr.name.length + 2 <= 140) {
			dscrLength = dscrLength + rbr.name.length + 2;
			dscrPluses.push(rbr.name);
		  }
		});

		if (dscrPluses.length > 0){
		  pageDscr += ': ' + dscrPluses.join(', ');
		}
		
		readiness.ok($scope.spec.name + ' - ' + $scope.agglo.local_name + ' - услуги мастеров и салонов красоты', pageDscr,
					 canonicalUrl);
	  };

	  var handleServStat = function(r){	
		$scope.allRubrics = r.arr_serv_rubric_stat;

		var rubrics = [];
	  	if ($scope.allRubrics){
	  	  angular.forEach($scope.allRubrics, function(rbr){
	  		if (rbr.serv_group_id === $scope.spec.id){
	  		  rubrics.push(rbr);
	  		}
	  	  });
	  	}

		//  | orderBy: '-count_master_serv' 
		rubrics.sort((a, b) => {
		  // desc
		  if (a.count_master_serv < b.count_master_serv) {
			return 1;
		  } else {
			return -1;
		  }
		});

		// for dynamic update - use watch instead
		// $scope.$watch('allRubrics', function(arr){
		// }, true);
	  	$scope.rubrics = rubrics;
	  };

	  var catchServStat = function(reason) {
		$scope.err_rubrics = {
		  msg: 'Ошибка загрузки категорий. Пожалуйста, попробуйте позже',
		  reason: reason
		};
		
    	console.log(reason);
		readiness.serverError(new Error(reason));
	  };
	  
      servGroupRepo.retrieveData()
		.then(function(arrServGroup){
		  
		  servStatRepo.retrieveData($scope.agglo.id, arrServGroup)
			.then(handleServStat)
			.then(handleReady)
			.catch(catchServStat);

		});

	  $timeout(function(){      
		$scope.is_prg = true;
      }, 500);
	}
  }
  
  var drct = function(){
	return {
	  restrict: 'A',
	  scope: {
		agglo: '=',
		spec: '='
	  },
	  templateUrl: 'agglo-item/spec-item/rubric-list/rubric-list.tpl.html',
	  controller: [
		'$scope',
		'$timeout',
		'$state',
		'servGroupRepo',
		'servStatRepo',
		'readiness',
		Xpo
	  ]
	};
  };

  angular.module('myApp.rubricListDrct', [
	'myApp.servGroupRepo',
	'myApp.servStatRepo',
	'myApp.readiness'
  ])
	.directive('rubricListDrct', [
	  drct
	]);
  
})(window.angular);
