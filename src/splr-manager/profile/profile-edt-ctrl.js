(function(angular){
  'use strict';

  		  // ttl: 'Профиль - редактирование',
		  // dscr: 'Редактирование профиля мастера или салона красоты: наименование, биография, описание, опыт работы и т.п.'
  var xpo = function($scope, $timeout, apimas){

	// $scope.supplier from a parent view	

	var cbkFail = function(r){
	  $scope.update_progress = false;
	  switch (r.status){
	  case 422:		
 		alert('Ошибка ввода: ' + JSON.stringify(r.data));
		break;
	  default:
		alert('Непредвиденная ошибка. Не удалось сохранить. Попробуйте позже');
	  }
	  console.log(r);
	};

	var cbkSuccess = function(r){
	  $scope.update_progress = false;
	  $scope.is_saved = true;
	  $timeout(function(){
		$scope.is_saved = false;
	  }, 1500);
	  console.log(r);
	};
	
	$scope.updateProfile = function(profileNew){
	  $scope.update_progress = true;
	  console.log(profileNew);
	  apimas.sendPost('/master/update-profile', profileNew)
		.then(cbkSuccess) // 2xx, 3xx codes
		.catch(cbkFail); // 4xx, 5xx codes
	};
  };
  
  angular.module('myApp.SplrProfileEdtController', [	
	'myApp.apimas',
  ])

	.controller('SplrProfileEdtController', [
	  '$scope',
	  '$timeout',
	  'apimas',
	  xpo
	]);
  
})(window.angular);
