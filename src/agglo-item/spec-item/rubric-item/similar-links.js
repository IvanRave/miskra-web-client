(function(angular){
  'use strict';

  // class Xpo{
  // 	constructor($scope){

  // 	}
  // }
  
  var drct = function(){
	return {
	  restrict: 'A',
	  templateUrl: 'agglo-item/spec-item/rubric-item/similar-links.tpl.html',
	  scope: {
		similarRubrics: '=',
		curAgglo: '='
	  }
	};
  };
  
  angular.module('myApp.appSimilarLinks', [])
	.directive('appSimilarLinks', [
	  drct
	]);
  
})(window.angular);
