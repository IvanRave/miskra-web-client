(function(angular){
  'use strict';

  // data: {
  //   ttl: 'Имэйл - редактирование',
  //   dscr: 'Редактирование электронного адреса мастера или салона красоты'
  // }
  var xpo = function($scope, $timeout, apimas){	
	// $scope.supplier;

	var cbkFail = function(r){
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
	  console.log(r);
	  $scope.is_saved = true;
	  $timeout(function(){
		$scope.is_saved = false;
	  }, 1500);
	};
	
	$scope.updateEmail = function(objNew){
	  $scope.update_progress = true;

	  apimas.sendPost('/master/update-email', objNew)
		.then(cbkSuccess) // 2xx, 3xx codes
		.catch(cbkFail) // 4xx, 5xx codes
		.finally(function(){
		  $scope.update_progress = false;
		});
	};
  };

  var drct = function(){
	return {
	  restrict: 'A',
	  scope: {
		supplier: '='
	  },
	  templateUrl: 'splr-manager/email/email-edt.tpl.html',
	  controller: [
		'$scope',
		'$timeout',
		'apimas',
		xpo
	  ]
	};
  };
  
  angular.module('myApp.splrEmailEdt', [
	'myApp.apimas'
  ])

	.directive('splrEmailEdt', [
	  drct
	]);
  
})(window.angular);
