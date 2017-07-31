(function(angular){
  'use strict';
  
  var drct = function(){
	return {
	  restrict: 'A',
	  scope: {
		ctct: '='
	  },
	  templateUrl: 'splr/main/splr-contact/splr-contact.tpl.html'
	};
  };

  angular.module('myApp.splrContactDrct', [])
	.directive('splrContactDrct', [
	  drct
	]);
  
})(window.angular);
