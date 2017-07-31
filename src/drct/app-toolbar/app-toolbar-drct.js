(function(angular){
  'use strict';

  var drct = function(){
	return {
	  restrict: 'A',
	  scope: {
		arrSearchItem: '=',
		aggloName: '=',
		specName: '=',
		rubricName: '=',
		rviewId: '=',
		rviewName: '=',
		splrId: '=',
		splrName: '='
	  },
	  templateUrl: 'drct/app-toolbar/app-toolbar.tpl.html'
	};
  };

  angular.module('myApp.appToolbar', [])
	.directive('appToolbar', [
	  drct
	]);
  
})(window.angular);
