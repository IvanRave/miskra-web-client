(function(angular){
  'use strict';

  class Xpo{
	constructor($scope, $state, sessRepo){	  
	  /**
	   * Link to login page
	   * @type {String}
	   */
	  $scope.href_login = $state.href('byt.oauthLogin', {});

	  var logout = function(){
		sessRepo.deleteSess();
	  };

	  $scope.logout = logout;

	  $scope.confirmLogout = function(){
		if (window.confirm('Выйти из аккаунта?')){
		  logout();
		}
	  };
	  
	  var init = function(){
		var cbkCatch = function(reason){
		  alert('Ошибка авторизации');
		  console.log(reason);
		  return;
		};

		var cbkSuccess = function(){

		  $scope.sessData = sessRepo.getData();
		  
		  if ($scope.sessData.is_supplier){
			/**
			 * Href to manage, only if authed (only for masters)
			 * @type {string}
			 */
			$scope.href_manage = $state.href('byt.splrManager.profile', {
			  supplier_id: $scope.sessData.uid
			});

			/**
			 * Href to supplier info
			 * @type {String}
			 */
			$scope.href_supplier = $state.href('byt.splrItem.main', {
			  supplier_id: $scope.sessData.uid
			});		  
		  }
		};

		sessRepo.retrieveSess()
		  .then(cbkSuccess)
		  .catch(cbkCatch);	 
	  };

	  init();
	}
  }

  var drct = function(){
	return {
	  restrict: 'A',
	  templateUrl: 'drct/user-status/user-status.tpl.html',
	  controller: [
		'$scope',
		'$state',
		'sessRepo',
		Xpo
	  ]
	};
  };
  
  angular.module('myApp.userStatusDrct', [
	'myApp.sessRepo'
  ])
	.directive('userStatusDrct', [
	  drct
	]);
  
})(window.angular);
