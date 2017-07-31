(function(angular){
  'use strict';

  	  	// data: {
	  	//   ttl: 'Телефон - редактирование',
		//   dscr: 'Редактирование номера телефона мастера или салона красоты'
	  	// }
  var xpo = function($scope, $timeout, apimas){

	var cbkFail = function(r){
	  switch (r.status){	  
	  case 422:
		var dtl = r.data.details;
		
		if (dtl){
		  if (r.data.errkey === 'validationError' &&
			  dtl.property === 'main_phone'){
			alert('Неправильный формат: используйте +7xxxzzzzzzz');
			break;
		  }

		  if (r.data.errkey === 'duplicateKeyError' &&
			  dtl.property === 'main_phone') {
			alert('Мастер или салон с таким номеров уже зарегистрирован в системе. Попробуйте указать другой номер.');
			break;
		  }
		}
		
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
	
	$scope.updatePhone = function(objNew){
	  // TODO: define country and check format of mobile phone
	  
	  $scope.update_progress = true;

	  apimas.sendPost('/master/update-phone', objNew)
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
	  templateUrl: 'splr-manager/phone/phone-edt.tpl.html',
	  controller: [
		'$scope',
		'$timeout',
		'apimas',
		xpo
	  ]
	};
  };
  
  angular.module('myApp.splrPhoneEdt', [
	'myApp.apimas'
  ])

	.directive('splrPhoneEdt', [
	  drct
	]);
  
})(window.angular);
