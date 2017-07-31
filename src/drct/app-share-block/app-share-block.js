(function(angular){
  'use strict';
  
  var drct = function(){
  
  	return {
	  restrict: 'A',
	  templateUrl: 'drct/app-share-block/app-share-block.tpl.html',
	  scope: {
		title: '@',
		permalink: '@',
		pageImage: '@'
	  }
	};
  };

  angular.module('myApp.appShareBlock', [
  ])

	.directive('appShareBlock', [
	  drct
	]);
})(window.angular);
