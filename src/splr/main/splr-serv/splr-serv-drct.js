(function(angular){
  'use strict';
  
  var drct = function(){
	return {
	  restrict: 'A',
	  scope: {
		msrv: '=',
		citySpecHref: '=',
		isEditable: '='
	  },
	  templateUrl: 'splr/main/splr-serv/splr-serv.tpl.html'
	};
  };

  angular.module('myApp.splrServDrct', [])
	.directive('splrServDrct', [
	  drct
	]);
  
})(window.angular);
