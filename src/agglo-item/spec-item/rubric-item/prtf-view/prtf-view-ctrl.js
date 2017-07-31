// TODO: show photos for search engines
//       after switching to our masters
(function(angular){
  'use strict';

  var init = function($scope,
					  $state,
					  $location,
					  prtfRepo,
					  next){

	$scope.rview_id = 'prtf';
	$scope.rview_name = 'Фото';
	// load data for phantom (crawlers) requests:
	// there are 4 photos pre-rendered only + links to masters
	// if (typeof window.callPhantom === 'function') {
	//   // before any data loading: no overflow for nstg limits
	//   next();
	//   return;
	// }

	var tmpPageHeader = `Фото`;

	if ($scope.cur_rubric.case_gen){
	  tmpPageHeader += ' ' + $scope.cur_rubric.case_gen;
	} else {
	  tmpPageHeader += ' ' + $scope.cur_rubric.name;
	}

	if ($scope.cur_agglo.case_prepositional){
	  tmpPageHeader += ' в ' + $scope.cur_agglo.case_prepositional;
	} else {
	  tmpPageHeader += ' ' + $scope.cur_agglo.local_name;
	}
	

	$scope.page_header =  tmpPageHeader;

	$scope.vpos = {
	  val: 0
	};

	$scope.$watch('vpos.val', function(wrapScrollTop){
	  // console.log("posval", wrapScrollTop);

	  angular.forEach($scope.arr_prtf_work, function(item){
		if (!item.is_show) {		
		  var elem = document.getElementById('work' + item.id);

		  if (elem && elem.offsetTop > wrapScrollTop - 250 && elem.offsetTop < wrapScrollTop + 800) {
			// show item content
			item.is_show = true;
		  }
		}
	  });
	});

	var cbkError = function(reason){
	  next({
		msg: 'Ошибка загрузки фотографий. Попробуйте позже.',
		dtl: reason
	  });
    };

	var cbkSuccess = function(arrPrtfWork){
	  next(null, arrPrtfWork);
	};
	
    prtfRepo.retrieveData(
	  $scope.cur_rubric.id,
	  $scope.cur_agglo.id)
	  .then(cbkSuccess)
	  .catch(cbkError);
  };
  
  var xpo = function($scope,
					 $state,
					 $location,
					 readiness,
					 prtfRepo){

	// parent
	// cur_agglo
	// cur_spec
	// cur_rubric

	

	init($scope,
		 $state,
		 $location,
		 prtfRepo,
		 function(err, arrPrtfWork){
		   if (err){
			 $scope.err_arr_prtf_work = err;
			 // console.log(JSON.stringify(err));
			 readiness.serverError();
			 return;
		   }

		   var readyAll = function(){
			 var canonicalUrl = $state.href("byt.aggloItem.specItem.rubricItem.prtfView",{
			   agglo_local_name: $scope.cur_agglo.local_name,
			   spec_name: $scope.cur_spec.name,	  
			   rubric_name: $scope.cur_rubric.name
			 });

			 var itemCount = $scope.arr_prtf_work.length;
			 var foundStr = '';
			 if (itemCount){
			   foundStr = ' (' + itemCount + 'шт.)';
			 }

			 var rubricStr = '';

			 if ($scope.cur_rubric.case_gen){
			   rubricStr = ' ' + $scope.cur_rubric.case_gen;
			 } else {
			   rubricStr = ' по услуге ' + $scope.cur_rubric.name;
			 }
			 
			 readiness.ok(`Фото${foundStr} - ${$scope.cur_rubric.name} - ${$scope.cur_agglo.local_name} - 2016 год`,
						  `Фотографии${foundStr}${rubricStr} в ${$scope.cur_agglo.case_prepositional}: красивые фото в хорошем качестве, 2015-2016 год, модные тенденции, дизайнерские решения`, canonicalUrl);
		   };

		   var calcElemPos = function(hsh){
			 if (hsh){
			   var elem = document.getElementById('work' + hsh);

			   if (elem){
				 var offs = elem.offsetTop;

				 if (offs) {
				   // -50 center it: cut top and bottom elements
				   //   to see main element in centre
				   return offs - 50;
				 }
			   }
			 }
			 // some padding to execute scroll (for first elements)
			 return 1;
		   };

		   // next: servListRepeatFinished
		   // when arr_prtf_work is attached - this event is started
		   $scope.$on('servListRepeatFinished',  function() {
			 // event
			 // this event is not fired when no list items
			 //console.log('servListRepeatFinished');

			 //console.log('ngRf', e);
			 //you also get the actual event object
			 //do stuff, execute functions -- whatever...
			 $scope.vpos.val = calcElemPos($location.hash());

			 readyAll();
		   });
		   
		   /**
			* Attach repo data to this value
			*   Lancer repo updated every time, when a user changes
			*   slc_arr_serv_rubric, selecting or unselecting
			*   rubrics (from left menu)
			*/		   
		   $scope.arr_prtf_work = arrPrtfWork;

		   if (arrPrtfWork.length === 0) {
			 readyAll();
		   }
		 });
  };
  
  angular.module('myApp.PrtfViewController', [
    'myApp.drct',
	'myApp.prtfRepo',
	'myApp.appScrollWatcher',
	'myApp.prtfItemDrct',
	'myApp.readiness'
  ])

    .controller('PrtfViewController', [
      '$scope',
      '$state',
	  '$location',
	  'readiness',
	  'prtfRepo',
      xpo]);
  
})(window.angular);
