(function(angular){
  'use strict';

  // use browser cache instead to return after master info
  
  var xpo = function($scope,
					 $state,
					 $location,
					 $q,
					 readiness,
					 apimas,
					 supListRepo,
					 splrAddressHelper,
					 sessRepo){

	$scope.rview_id = 'tbl';
	$scope.rview_name = 'Каталог';

	var tmpPageHeader = '';

	if ($scope.cur_rubric.case_dat){
	  tmpPageHeader = 'Мастера по ' + $scope.cur_rubric.case_dat;
	} else {
	  tmpPageHeader = $scope.cur_rubric.name;
	}

	if ($scope.cur_agglo.case_prepositional){
	  tmpPageHeader += ' в ' + $scope.cur_agglo.case_prepositional;
	} else {
	  tmpPageHeader += ' ' + $scope.cur_agglo.local_name;
	}
		
	// {{cur_rubric.name}} в {{cur_agglo.case_prepositional}}: мастера и салоны красоты
	$scope.page_header = tmpPageHeader;
	
	// data from parent scopes
	// $scope.cur_agglo
	// $scope.cur_spec
	// $scope.cur_rubric

	// do not clean previous data:
	//   show new data instead previous
	//   hide previous if not loaded yet

	//var rubrId = $scope.cur_rubric.id;
	//var specId = $scope.cur_spec.id;	

	$scope.vpos = {
	  val: 0
	};
	
	$scope.$watch('vpos.val', function(wrapScrollTop){ // newVal
	  //console.log('newVal', wrapScrollTop);
	  angular.forEach($scope.arr_supplier, function(item){
		if (!item.is_works_once) {
		  // todo: optimize - build elem tree before
		  var elem = document.getElementById('supplier' + item.id);
		  // alternative: use newPos to calculate this condition
		  //if isElemInViewport(elem, 500)){
		  //console.log('elem', elem.offsetTop, wrapScrollTop);
		  if (elem && elem.offsetTop > wrapScrollTop - 101 && elem.offsetTop < wrapScrollTop + 900) {
			// try to load once per supItem
			// it assigned before results of a query
			//   to skip the same concurrent requests
			item.is_works_once = true;

			apimas.sendGet("/work/get-by-master-and-rubric",{
	  		  master_profile_id: item.id,
	  		  serv_rubric_id: $scope.cur_rubric.id,
			  // usually a user watches first 5 images and makes decision
	  		  limit: 5
			}).then((r) => r.arr_table_work)
			  .then(function(arr) {
				console.log('arr_table_work', item.id, arr);
				item.work_scope ={
				  arr: arr
				};
			  })
			  .catch(function(err){
				console.log('err_table_work', item.id, err);
				item.work_scope = {
				  err: err
				};
			  });
			// retrieveWorks(item.id, rubricId);
			// attach works to supItem
			// show gallery
			// if error - attach error to supItem			
		  }
		}
	  });
	});
	
	var cbkFail = function(tmpErr){
	  $scope.err_msg = 'Ошибка загрузки мастеров и салонов. Попробуйте позже';
	  readiness.serverError(tmpErr);
	};

	var readyAll = function(){
	  var canonicalUrl = $state.href("byt.aggloItem.specItem.rubricItem.tblView",{
		agglo_local_name: $scope.cur_agglo.local_name,
		spec_name: $scope.cur_spec.name,	  
		rubric_name: $scope.cur_rubric.name
	  });

	  var supLength = $scope.arr_supplier.length;

	  var rubricStr;

	  if ($scope.cur_rubric.case_dat) {
		rubricStr = ` по ${$scope.cur_rubric.case_dat}`;
	  } else {
		rubricStr = `, предоставляющие услугу ${$scope.cur_rubric.name}`;
	  }
	  
	  var pageDscr = `Избранные мастера и салоны красоты${rubricStr} из ${$scope.cur_agglo.case_genitive}: найдено ${supLength} - контакты, фотографии работ, профили в соцсетях`;
	  
	  readiness.ok(`${$scope.cur_rubric.name} - ${$scope.cur_agglo.local_name} - мастера и салоны красоты - найдено ${supLength}`,
				   pageDscr,
				   canonicalUrl);
	};

	// $scope.checkData = {
	//   isBioHided: false
	// };

	// | filter: bioFilter as filteredList
	// $scope.bioFilter = function (item) {
	//   if ($scope.checkData.isBioHided) {
	// 	// hide all records with bio (filled already)
	// 	return !item.bio;
	//   } else {
	// 	// show all by default
	// 	return true;
	//   }
	// };

	$scope.sessData = sessRepo.getData();	

	// todo: move to server side
	var attachGeo = function(arrSupplier){
	  angular.forEach(arrSupplier, function(item){
		// console.log('supItem', item);
		if (item.master_address){
		  // item.master_address.geo_district_id
		  
		  var dscr = item.master_address.description;
		  if (dscr){
			item.sup_geo = splrAddressHelper.calcAddrFromDescription(dscr);
			item.cus_geo = splrAddressHelper.calcOutGeoFromDescription(dscr);

			if (!item.sup_geo && !item.cus_geo){
			  console.log('dscr parsing problem',
						  item.id,
						  item.name,
						  dscr);
			}
		  }
		}
	  });
	};

	var calcElemPos = function(hsh){
	  if (hsh){
		var elem = document.getElementById('supplier' + hsh);

		if (elem){
		  var offs = elem.offsetTop;

		  if (offs) {
			// center it: cut top and bottom elements
			//   to see main element in centre
			return offs - 4; // + 50;
			// minus margin to show full card with border
		  }
		}
	  }
	  // some padding to execute scroll (for first elements)
	  return 1;
	};
	
	var handleResult = function(arrSupplier){
	  attachGeo(arrSupplier);
	  
	  // similar articles
	  var dfr = $q.defer();
	  $scope.$on('supplierListRepeatFinished',  function() {
		// event
		//console.log('servListRepeatFinished');
		// if no items: this event may be not fired

		//console.log('ngRf', e);
		//you also get the actual event object
		//do stuff, execute functions -- whatever...
		//console.log('hashId', hsh);
		$scope.vpos.val = calcElemPos($location.hash());

		dfr.resolve();
	  });
	  
	  $scope.arr_supplier = arrSupplier;

	  if ($scope.arr_supplier.length === 0) {
		dfr.resolve();
	  }	  

	  return dfr.promise;
	};

	// var calcFitPosts = function(){
	//   postRepo.retrieveListByRubric($scope.cur_rubric.name)
	// 	.then(function(data){
	// 	  console.log('fit articles');
	// 	  console.log(data);
	// 	  //$scope.fit_articles = arrArticle;
	// 	})
	// 	.catch(function(err){
	// 	  // skip err
	// 	  // todo: send to admin
	// 	  console.log(err);
	// 	});
	
	// };

	// retrieve 99 masters by a specific rubric
	supListRepo.retrieveByRubric(
	  $scope.cur_rubric.id,
	  $scope.cur_agglo.id,
	  '',
	  99)
	  .then(handleResult)
	//	  .then(calcFitPosts)
	  .then(readyAll)
	  .catch(cbkFail);
  };
  

  angular.module('myApp.TblViewController', [
	'myApp.appTblItem',
	'myApp.appScrollWatcher',
	'myApp.appWorkGallery',
	'myApp.supListRepo',
	'myApp.splrAddressHelper',
	'myApp.sessRepo',
	'myApp.readiness',
	'myApp.apimas'
  ])
  
    .controller('TblViewController', [
	  '$scope',
	  '$state',
	  '$location',
	  '$q',
	  'readiness',
	  'apimas',
	  'supListRepo',
	  'splrAddressHelper',
	  'sessRepo',
      xpo
	]);
  
})(window.angular);

	  // run all listeners
	  // for (var objKey in $scope.listeners){
	  // 	$scope.listeners[objKey](newPos);
	  // }
