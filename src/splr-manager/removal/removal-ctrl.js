(function(angular){
  'use strict';

  // data: {
  //   ttl: 'Аккаунт - удаление',
  //   dscr: 'Удаление аккаунта мастера или салона красоты: удаление всех связанных данных и выход из системы'
  // }
  var xpo = function($scope,
					 $state,
					 sessRepo,
					 apimas){

	var cbkSuccess = function(){
	  console.log('sessRepoData', sessRepo.getData());
	  if (!sessRepo.getData().is_editor) {
		// do not exit if a moderator
		// exit if a master or salon
		sessRepo.deleteSess();
	  }
	  // do not exit if a moder
	  $scope.is_progress = false;
	  $state.go('byt.welcome');
	};

	var cbkFail = function(reason){
	  $scope.is_progress = false;
	  console.log(reason);
	  $scope.err_msg = 'Непредвиденная ошибка: не удалось удалить. Попробуйте позже';
	};
	
	$scope.removeAccount = function(tmpSupplier){
	  $scope.err_msg = null;
	  console.log('removed', tmpSupplier);
	  $scope.is_progress = true;
	  apimas.sendPost("/master/delete-master", {
		id: tmpSupplier.id
	  })
		.then(cbkSuccess)
		.catch(cbkFail);
	  
	  // clean a session
	  // redirect to main page
	};
  };
  
  angular.module('myApp.SplrRemovalController', [
	'myApp.sessRepo'
  ])

	.controller('SplrRemovalController', [
	  '$scope',
	  '$state',
	  'sessRepo',
	  'apimas',
	  xpo]);
  
})(window.angular);
