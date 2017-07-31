(function(angular){
  'use strict';
  
  var drct = function(){
  
  	return {
	  restrict: 'A',
	  templateUrl: 'drct/app-informer/app-informer.tpl.html'
	};
  };

  angular.module('myApp.appInformer', [
  ])

	.directive('appInformer', [
	  drct
	]);
  
})(window.angular);
