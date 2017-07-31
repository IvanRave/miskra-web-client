(function(angular){
  'use strict';

  class Xpo{
	constructor($scope, $q, $state, apimas, servGroupRepo){	

	  $scope.isFree = function(criteria){
		if ($scope.arr_master_serv){
		  return $scope.arr_master_serv.filter(item => item.serv_rubric_id === criteria.id).length === 0;
		}
		return true;
	  };

	  $scope.arr_ids = [];
	  $scope.handleChange = function(isChecked, rbrId){
		if (isChecked){
		  $scope.arr_ids.push(rbrId);
		} else {
		  var ind = $scope.arr_ids.indexOf(rbrId);
		  if (ind >= 0){
			$scope.arr_ids.splice(ind, 1);
		  }
		}
		console.log($scope.arr_ids);
	  };

	  var ins = function(arrIds, ind){
		if (arrIds[ind]){
		
		  return apimas.sendPost('/master/upsert-serv', {
			master_profile_id: $scope.supplier.id,
			serv_rubric_id: arrIds[ind],
			is_out: false // required field
		  }).then(function(){
			return ins(arrIds, ind + 1);
		  });
		} else {
		  return $q.when();
		}
	  };
	  
	  $scope.addServs = function(arrIds){
		if (arrIds.length === 0){
		  return;
		}
		$scope.err_insert = null;
		$scope.is_progress = true;
		// run iteration
		ins(arrIds, 0)
		  .then(function(){
			$scope.is_progress = false;
			$state.go('byt.splrManager.servList', {
			  supplier_id: $scope.supplier.id
			});			
		  })
		  .catch(err => {
			$scope.err_insert = err;
			$scope.is_progress = false;
		  });
	  };
	  
	  // need to retrieve all existing rubrics
	  apimas.sendGet("/master/get-servs-by-master", {
  		master_profile_id: $scope.supplier.id,
		lang: 'ru'
  	  }, true)
		.then((response) => {
		  $scope.arr_master_serv = response.arr_master_serv;
		  console.log('servs', $scope.arr_master_serv);
		})
		.then(() => servGroupRepo.retrieveWithRubrics())
		.then(function(arr){
		  console.log('with  rubrics', arr);
		  $scope.arr_serv_group = arr;
		})
		.catch((err) => {
		  $scope.err_master_serv = err;
		});
	}
  }
					   
  
  var drct = function(){
	return {
	  restrict: 'A',
	  scope: {
		supplier: '='
	  },
	  templateUrl: 'splr-manager/serv-creator/serv-creator-edt.tpl.html',
	  controller: [
		'$scope',
		'$q',
		'$state',
		'apimas',
		'servGroupRepo',
		Xpo
	  ]
	};
  };

  angular.module('myApp.servCreatorEdt', [
	'myApp.apimas',
	'myApp.servGroupRepo'
  ])
	.directive('servCreatorEdt', [
	  drct
	]);
  
})(window.angular);
