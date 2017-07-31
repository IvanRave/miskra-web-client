(function(angular){
  'use strict';

  // class Xpo{
  // 	constructor($scope){

  // 	}
  // }
  
  var drct = function(){
	return {
	  restrict: 'A',
	  templateUrl: 'agglo-item/spec-item/rubric-item/outer-links.tpl.html',
	  scope: {
		curAgglo: '=',
		curSpec: '=',
		curRubric: '='
	  }
	  // controller: [
	  // 	'$scope',
	  // 	Xpo
	  // ]
	};
  };
  
  angular.module('myApp.appOuterLinks', [])
	.directive('appOuterLinks', [
	  drct
	]);
  
})(window.angular);
