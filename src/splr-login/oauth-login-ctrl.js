(function(angular, APPCONF){
  'use strict';

  var xpo = function($scope,
					 $state,
                     $interval,
                     lgr,
					 readiness,
					 sessRepo,
					 oauthEntry,
					 apimas){
	// a user can redirect back, using back button
	//, q_redirect_url

	// $scope.rdr_url = q_redirect_url;

	$scope.page_ttl = 'Вход для мастеров и салонов красоты';

	var cbkSuccessUpdate = function(){
	  var sessData = sessRepo.getData();
	  // uid must be not null (after log-in)
	  $state.go('byt.splrItem.main', {
		supplier_id: sessData.uid
	  });
	};

	var cbkCatchUpdate = function(reason){
      lgr.crit('oauthUpdateSess', 'catch', {
        reason: reason
      });
	};

	var cbkSuccessAuth = function(r){
	  sessRepo.updateSess(r.auth_token)
		.then(cbkSuccessUpdate)
		.catch(cbkCatchUpdate);
	};

	var cbkCatchAuth = function(r){
      lgr.crit('oauthCatch', 'oauth login', r);
	};

	var cbkSuccessCode = function(issuer_id, response_type, r){

	  var tkn = response_type === 'code' ? r.code : r.access_token;

	  if (!tkn){
		cbkCatchAuth('required: code or access_token');
		return;
	  }

	  apimas.sendOauth(tkn,
					   response_type,
					   APPCONF.OAUTH_CALLBACK,
					   issuer_id)
		.then(cbkSuccessAuth)
		.catch(cbkCatchAuth);
	};

	var cbkCatchCode = function(r){
      lgr.crit('oauthCatchCode', 'catch verification code', r);
	};

	$scope.openOauthNstg = function(){

	  oauthEntry.loginNstg(APPCONF.OAUTH_NSTG_ID,
	  					   'code',
	  					   APPCONF.OAUTH_CALLBACK,
	  					   [])
	  // oauthEntry.loginVkn(APPCONF.OAUTH_VKN_ID,
	  // 					  'code',
	  // 					  REDIRECT_URI,
	  // 					  [])
		.then(angular.bind(null, cbkSuccessCode, 'nstg', 'code'))
		.catch(cbkCatchCode);
	};

	$scope.openOauthVkn = function(){

	  oauthEntry.loginVkn(APPCONF.OAUTH_VKN_ID,
	  					  'code',
	  					  APPCONF.OAUTH_CALLBACK,
	  					  [])
		.then(angular.bind(null, cbkSuccessCode, 'vkn', 'code'))
		.catch(cbkCatchCode);
	};

	readiness.ok($scope.page_ttl,
				 'Вход или регистрация для мастеров и салонов красоты с использованием аккаунта Инстаграм: автоматический экспорт работ и услуг, переход в личный кабинет',
				 $state.href("byt.oauthLogin"));
  };

  angular.module('myApp.OauthLoginController', [
	'myApp.oauthEntry',
	'myApp.apimas',
	'myApp.sessRepo',
	'myApp.readiness',
    'myApp.appLoginEmail'
  ])

	.controller('OauthLoginController', [
	  '$scope',
	  '$state',
      '$interval',
      'lgr',
	  'readiness',
	  'sessRepo',
	  'oauthEntry',
	  'apimas',
	  // 'q_redirect_url',
	  xpo
	]);

})(window.angular, window.APPCONF);
