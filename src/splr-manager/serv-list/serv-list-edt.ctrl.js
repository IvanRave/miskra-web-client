(function(angular){
  'use strict';

  // data: {
  //   ttl: 'Услуги - редактирование',
  //   dscr: 'Редактирование услуг и работ мастера или салона красоты: экспорт из соотвествующего аккаунта'
  // }
  class Xpo{
	constructor($scope, apimas){
	  
	  return apimas.sendGet("/master/get-servs-by-master", {
  		master_profile_id: $scope.supplier.id,
		lang: 'ru'
  	  }, true).then((response) => {
		$scope.arr_master_serv = response.arr_master_serv.sort((a, b) => {
		  if (a.serv_rubric_name > b.serv_rubric_name) {
			return 1;
		  } else {
			return -1;
		  }
		});
		console.log($scope.arr_master_serv);
	  }).catch((err) => {
		$scope.err_master_serv = err;
	  });
	  
	}
  }

  angular.module('myApp.SplrServListEdtController', [
	'myApp.apimas'
  ])

	.controller('SplrServListEdtController', [
	  '$scope',
	  'apimas',
	  Xpo]);
  
})(window.angular);
