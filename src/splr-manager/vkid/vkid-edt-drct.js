(function(angular){
  'use strict';

  // http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric/1830844#1830844
  function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
  }

  var xpo = function($scope, $timeout, apimas){

	var cbkFail = function(r){
	  switch (r.status){	  
	  case 422:
		var dtl = r.data.details;
		
		if (dtl){
		  if (r.data.errkey === 'validationError' && dtl.vk_id){
			alert('Неверный формат идентификатора');
			break;
		  }

		  if (r.data.errkey === 'duplicateKeyError') {
			alert('Мастер или салон с таким ID уже зарегистрирован в системе. Попробуйте указать другой ID.');
			break;
		  }
		}
		
 		alert('Ошибка данных: ' + JSON.stringify(r.data));
		break;
	  default:
		alert('Непредвиденная ошибка: не удалось сохранить - попробуйте позже');
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
	
	$scope.updateVkid = function(masterProfileId, vkId){
	  if (!vkId) {
		alert('Ошибка: необходимо указать идентификатор');
		return;
	  }

	  if (isNumeric(vkId) === false) {
		alert('Ошибка: необходимо указать число');
		return;
	  }

	  // convert to number
	  vkId = +vkId;

	  $scope.update_progress = true;

	  apimas.sendPost('/master/update-vk-id', {
		id: masterProfileId,
		vk_id: vkId
	  })
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
	  templateUrl: 'splr-manager/vkid/vkid-edt.tpl.html',
	  controller: [
		'$scope',
		'$timeout',
		'apimas',
		xpo
	  ]
	};
  };
  
  angular.module('myApp.splrVkidEdt', [
	'myApp.apimas'
  ])

	.directive('splrVkidEdt', [
	  drct
	]);
  
})(window.angular);
