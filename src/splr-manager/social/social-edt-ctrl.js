(function(angular){
  'use strict';

  // data: {
  //   ttl: 'Соцконтакты - редактирование',
  //   dscr: 'Редактирование контактов мастера или салона красоты: ссылки в социальных сетях и на личные сайты, контакты популярных мессенджеров: скайп, вибер, вотсап'
  // }
  var xpo = function($scope, $timeout, apimas){

	var handleDuplicate = function(constraint){
	  if (constraint.indexOf("uq_master_profile__") !== 0){
		return null;
	  }
	  //"uq_master_profile__facebook"
	  var socialStr = constraint.replace("uq_master_profile__", "");
	  if (socialStr === 'landline'){
		return 'стационарный телефон';
	  }
	  return socialStr;	  
	};

	var handleCheckViolation = function(constraint){
	  if (constraint.indexOf("bw_master_profile__") !== 0){
		return null;
	  }
	  var socialStr = constraint.replace("bw_master_profile__", "");
	  if (socialStr === 'landline'){
		return 'стационарный телефон';
	  }
	  return socialStr;	  
	};
	
	var cbkFail = function(r){
	  switch (r.status){	  
	  case 422:
		var dta = r.data;
		if (dta.errkey === "duplicateKeyError"){
		  if (dta.details && dta.details.property){
			var fieldDupl = handleDuplicate(dta.details.property);
			if (fieldDupl){
			  alert(`Ошибка ввода: указанное значение поля "${fieldDupl}" уже занято: попробуйте указать другое либо оставьте поле пустым`);
			  return;
			}
		  }
		}

		if (dta.errkey === "validationError") {
		  if (dta.details && dta.details.property){
			var fieldCheck = handleCheckViolation(dta.details.property);
			if (fieldCheck){
			  alert(`Ошибка ввода: неверный формат значения "${fieldCheck}": попробуйте указать другое либо оставьте поле пустым`);
			  return;
			}
		  }
		}
		
 		alert('Ошибка ввода: ' + JSON.stringify(dta));
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
	
	$scope.updateProfile = function(prf){
	  $scope.update_progress = true;
	  console.log(prf);
	  
	  apimas.sendPost('/master/update-profile', prf)
		.then(cbkSuccess) // 2xx, 3xx codes
		.catch(cbkFail) // 4xx, 5xx codes
		.finally(function(){
		  $scope.update_progress = false;
		});
	};

	// $scope.supplier.vkontakte  =	$scope.supplier.vkontakte || 'https://vk.com/';
  };
  
  angular.module('myApp.SplrSocialEdtController', [
	'myApp.apimas'
  ])

	.controller('SplrSocialEdtController', [
	  '$scope',
	  '$timeout',
	  'apimas',
	  xpo
	]);
  
})(window.angular);
