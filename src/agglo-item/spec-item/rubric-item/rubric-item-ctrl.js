(function(angular){
  'use strict';
  
  var xpo = function($scope,
					 $timeout,
					 $q,
					 $state,
					 readiness,
					 servGroupRepo,
					 servStatRepo,
					 blogRepo,
					 rubricHelper,
					 q_rubric_name){

	// from parent view
	// $scope.cur_spec must be
	// $scope.cur_agglo

	var handleServStat = function(r){ // r
		// $scope.arr_serv_group = r.arr_serv_group;
		// load child views
		
		// this property is independent of rubric_arr
		// and may be retrieved using own request: /rubrics/:name

		var curServRubric = r.arr_serv_rubric_stat.filter((rbr) => {
		  return rbr.name === q_rubric_name;
		})[0];

		if (!curServRubric){
		  $scope.err_cur_rubric = {
			msg: `Мастера и салоны красоты, предоставляющие услугу "${q_rubric_name}" в городе ${$scope.cur_agglo.local_name} не найдены`
		  };
		  
		  readiness.notFound();
		  return;
		} else {

		  //similarRubrics
		  
		  $scope.similar_rubrics = rubricHelper.calcSimilarRubrics(r.arr_serv_rubric_stat, curServRubric);

		  $scope.rubric_articles = blogRepo.calcByRubricId(curServRubric.id);
		  
		  $scope.cur_rubric = curServRubric;
		  // readiness - in nested views

		  // var similar = 

		  // angular.forEach(similar, (item) => {
		  // 	console.log(item.weight, item.item.name);
		  // });
		  // console.log('similar', similar);
		}
		
	};

	var catchServStat = function(reason) {
	  $scope.err_cur_rubric = {
		msg: 'Ошибка загрузки услуги. Пожалуйста, попробуйте позже',
		reason: reason
	  };

	  console.log('retrieveData', reason);
	  readiness.serverError(new Error(reason));
    };
	
    /**
     * Selected rubric with id like hairExt, hairCut
     * @type {Object}
     * serv_rubric: {}
     */
    servGroupRepo.retrieveData()
      .then(function(arrServGroup){
		servStatRepo.retrieveData($scope.cur_agglo.id, arrServGroup)
		  .then(handleServStat)
		  .catch(catchServStat);
	  });
	


	// todo: select rubric after redirection
	//       add to search field

	$timeout(function(){      
      $scope.is_prg = true;
	}, 500);
  };
  
  angular.module('myApp.RubricItemController', [
    'myApp.drct',
	'myApp.appSimilarLinks',
	'myApp.appOuterLinks',
	'myApp.appBlogLinks',
	'myApp.servGroupRepo',
    'myApp.servStatRepo',
	'myApp.blogRepo',
	'myApp.rubricHelper',
//	'myApp.hprFactory',
	'myApp.readiness'
  ])

    .controller('RubricItemController', [
      '$scope',
	  '$timeout',
	  '$q',	  
      '$state',
	  'readiness',
	  'servGroupRepo',
      'servStatRepo',
	  'blogRepo',
	  'rubricHelper',
      'q_rubric_name',
      xpo]);
  
})(window.angular);
