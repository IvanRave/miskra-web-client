(function(angular){
  'use strict';

  class Xpo{
	constructor($scope, $state, $timeout, apimas, q_id){
	  // console.log('serv', q_id);

	  // console.log($scope.supplier.arr_master_serv.filter(item => item.id === q_id));

	  var deleteWorkRubrics = function(masterProfileId, servRubricId){
		// delete from work_rubric wr
		// inner join serv_work sw
		// where wr.serv_rubric_id = $1
		// and sw.master_profile_id = $2

		// delete from serv_work
		// where master_profile_id = $1
		// and count(work_rubric) === 0
		// remove works without work_rubrics
		return apimas.sendPost('/work/delete-by-master-and-rubric', {
		  master_profile_id: masterProfileId,
		  serv_rubric_id: servRubricId
		});
	  };
	  
	  $scope.deleteServ = function(tmpServ){
		if (window.confirm('При удалении услуги удаляются также все соответствующие данные, в том числе фотографии, привязанные к услуге')){
		  // если у работы нет никаких привязанных рубрик - то удалять


		  apimas.sendPost('/master/delete-serv', {
		  	id: tmpServ.id,
		  	master_profile_id: tmpServ.master_profile_id
		  })
		  	.then(() => deleteWorkRubrics(tmpServ.master_profile_id,
										  tmpServ.serv_rubric_id))
			.then(() => {
			  $state.go('byt.splrManager.servList', {
				supplier_id: tmpServ.master_profile_id
			  });
			})
		  	.catch(err => {
			  alert('Возникла непредвиденная ошибка. Повторите позже или обратитесь в техподдержку.');
			  console.log(err);
			});
		}
	  };

	  var catchUpdate = function(err){
		$scope.update_progress = false;
		if (err.status === 422){
		  $scope.err_update = 'Ошибка данных: попробуйте указать другие данные';
		  return;
		}

		$scope.err_update = 'Непредвиденная ошибка: повторите запрос позже';
	  };

	  var handleUpdate = function(){
		$scope.update_progress = false;
		console.log('success');
		
		$scope.is_saved = true;
		$timeout(function(){
		  $scope.is_saved = false;
		}, 1500);
	  };
	  
	  $scope.updateMsrv = function(tmpMsrv){
		if ($scope.update_progress) {
		  return;
		}
		$scope.err_update = null;
		console.log('update', tmpMsrv);
		$scope.update_progress = true;
		apimas.sendPost('/master/upsert-serv', tmpMsrv)
		  .then(handleUpdate)
		  .catch(catchUpdate);
	  };

	  var catchServ = function(err){
		  var msg = '';
		  if (err.status === 404){
			msg = `Услуга #${q_id} не найдена.`;
		  }else {
			msg = 'Непредвиденная ошибка. Попробуйте позже.';
		  }
		  
		  $scope.err_msrv = {
			status: err.status,
			msg: msg
		  };
	  };

	  // load works + work_rubrics
	  var loadWorks = function(){
		$scope.arr_serv_work = [];
	  };
	  
	  apimas.sendGet('/master/get-serv', {
		id: +q_id,
		lang: 'ru'
	  }, true).then(r => $scope.msrv = r)
		.then(loadWorks)
		.catch(catchServ);
	}
  }

  angular.module('myApp.SplrServItemEdtController', [
	'myApp.apimas'
  ])

	.controller('SplrServItemEdtController', [
	  '$scope',
	  '$state',
	  '$timeout',
	  'apimas',
	  'q_id',
	  Xpo]);
  
})(window.angular);
