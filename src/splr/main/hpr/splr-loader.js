(function(angular){
  'use strict';

  var xpo = function($q,
					 firmItemRepo,
				 	 apimas) {
	
	var loadSupplier = function(q_id,
								q_tpe,
								q_hash,
								isFreshMaster){

	  var defineMaster = function(){	
		switch (q_tpe){
		case 'map':
		  // do not load data for phantom (crawlers) requests
		  if (typeof window.callPhantom === 'function') {
			// before any data loading: no overflow for 2gis limits	
			return $q.reject({
			  msg: 'Данные карты не загружаются по запросам поисковых роботов',
			  dtl: 'window.callPhantom is not allowed'
			});
		  } else {
			return firmItemRepo.retrieveData(q_id, q_hash);
		  }
		  break;
		  // .then(cbkResult)
		  // .catch(cbkCatch);
		default:
		  return apimas.sendGet('/master/get-profile', {
			id: q_id
		  }, isFreshMaster);
		}
	  };

	  return defineMaster();

	  // return tmpSupplier

	  // handle catch in initiator
	  // catch - response.data | status
	};

	return {
	  loadSupplier: loadSupplier
	};
  };

  angular.module('myApp.splrLoader', [
	'myApp.firmItemRepo',
	'myApp.apimas'
  ])

	.factory('splrLoader', [
	  '$q',
	  'firmItemRepo',
	  'apimas',
	  xpo
	]);

  
})(window.angular);

// short variant of $scope.supplier
// $scope.splr
// .contactInfo
// .privateInfo
// .detailInfo
// .servs

//   id: q_id,
//   tpe: q_tpe,
//   hash: q_hash

// var cbkResult = function(tmpSupplier){
// 	if (!tmpSupplier){
// 	  return $q.reject({
// 		msg: 'Мастер / салон не найден. Возможно страница была удалена.',
// 		dtl: 'no tmpSupplier'
// 	  });

// 	} else {
// 	  return $q.when(tmpSupplier);
// 	  //next(null, tmpSupplier);
// 	  //$scope.supplier = tmpSupplier;
// 	  //console.log('supplier loaded: ' + tmpSupplier.name);
// 	}
// };

// var cbkCatch = function(response){
// 	var msg = '';
// 	if (response.status === 404) {
// 	  msg = ''
// 	}
// 	// no need to close a dialog and open new
// 	// just write in current dialog
// 	// a user will close it after reading a error
// 	return $q.reject({
// 	  msg:'Возникла непредвиденная ошибка. Повторите запрос позже.',
// 	  dtl: response
// 	});
// };
