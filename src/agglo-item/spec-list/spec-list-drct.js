(function(angular){
  'use strict';

  class Xpo{
	constructor($scope,
				$timeout,
				$state,
				readiness,
				servGroupRepo){
	  // 	,q_agglo_local_name
	  // $scope.agglo must be

	  $scope.calcHref = (specName) => $state.href("byt.aggloItem.specItem.rubricList", {
		agglo_local_name: $scope.agglo.local_name,
		spec_name: specName
	  });

      // unselect a group, using this method
      // do not use direct nulling - it doesn't clean this id
      // unselect all serv_rubrics: from selected parrubric
      
      // Load rubrics after agglo is selected:
      //   manually or automatically    
      // Remove inherit parameters:
      // inject or define from url again
      // Load rubrics only after city selected
      // step by step
	  // tmpAgglo.id,
	  servGroupRepo.retrieveData()
		.then(function(arr){	
		  $scope.groups = arr;

		  // ttl: '{agglo_local_name} - мастера и салоны красоты',
		  // dscr: ''

		  var canonicalPath =  $state.href('byt.aggloItem.specList', {
		  	agglo_local_name: $scope.agglo.local_name
		  });
		  
		  readiness.ok($scope.agglo.local_name + ' - услуги мастеров и салонов красоты',
					   'Перечень услуг красоты: парикмахеры, стилисты, визажисты, услуги по уходу за ногтями, ресницами, бровями и многое другое в '+
					   $scope.agglo.case_prepositional,
					  canonicalPath);
		})
		.catch(function(reason) {
		  $scope.err_groups = {
			msg: 'Ошибка загрузки категорий. Пожалуйста, попробуйте позже',
			reason: reason
		  };
		  
    	  console.log(reason);
		  readiness.serverError(new Error(reason));
		});
	  
      // show it with 500ms delay
      $timeout(function(){      
		$scope.is_prg = true;
      }, 500);
	}
  }
  
  var drct = function(){
	return {
	  restrict: 'A',	  
	  templateUrl: 'agglo-item/spec-list/spec-list.tpl.html',
	  scope: {
		'agglo': '='
	  },
	  controller: [
		'$scope',
		'$timeout',
		'$state',
		'readiness',
		'servGroupRepo',		
		Xpo
	  ]
	};
  };
  
  angular.module('myApp.specListDrct', [
	'myApp.leftLinkDrct',
    'myApp.servGroupRepo',
	'myApp.readiness'
  ])
	.directive('specListDrct', [drct]);
  
})(window.angular);
