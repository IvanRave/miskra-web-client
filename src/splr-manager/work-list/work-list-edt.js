(function(angular){
  'use strict';

  class Xpo{
	constructor($scope, $state, apimas){

	  var catchDel = function(err){
		console.log(err);
		// $scope.err_obj = {
		//   msg: ''
		// };
		alert('Возникла непредвиденная ошибка в процессе удаления. Повторите позже либо обратитесь к администратору.');
	  };

	  var handleDel = function(r){
		console.log('removed handleDel', r);
		
		var arr = $scope.arr_serv_work;
		for (var i = arr.length - 1; i >= 0; i -= 1){
		  if (arr[i].id === r.serv_work_id){
			arr.splice(i, 1);
		  }
		}		

		// delete it from array: or update an array or images
	  };

	  $scope.deleteServWork = function(tmpServWorkId, tmpServRubricId){
		if (window.confirm('Удаление работы (фото или видео) невозвратно. Действительно удалить?')){
		  //console.log('delete', servWorkId);
		  // todo: add method to API
		  apimas.sendPost('/work/delete-by-work-and-rubric', {
			serv_work_id: tmpServWorkId,
			serv_rubric_id: tmpServRubricId
		  })
			.then(handleDel)
			.catch(catchDel);
		}
	  };

	  // $scope.$watch('vpos.val', function(wrapScrollTop){		
	  // 	console.log('newpos', wrapScrollTop);
	  // });

	  apimas.sendGet('/work/get-by-master-and-rubric', {
		master_profile_id: $scope.masterProfileId,
		serv_rubric_id: $scope.servRubricId,
		limit: 20
		// nstg allows load max 20 at one time
		// to show other images: user must remove previous
		// or add a button: load more images (next 20)
		// only if limit = count
	  }, true)
		.then(r => $scope.arr_serv_work = r.arr_table_work);
	}
  }

  
  var drct = function(){
	return {
	  restrict: 'A',
	  scope: {
		masterProfileId: '=',
		servRubricId: '=',
		servRubricName: '=',
		vpos: '=',
		canDelete: '=',
		canInsert: '='
	  },
	  templateUrl: 'splr-manager/work-list/work-list-edt.tpl.html',
	  controller: [
		'$scope',
		'$state',
		'apimas',
		Xpo
	  ]
	};
  };

  angular.module('myApp.workListEdt', [
	'myApp.apimas'
  ])
	.directive('workListEdt', [
	  drct
	]);

  
})(window.angular);
