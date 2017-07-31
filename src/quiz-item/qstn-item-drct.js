 // this view doesn't depends of previous questions

(function(angular){
  'use strict';

  class Xpo{
	// qstn_id - is a set of previous answers
	constructor($scope){

	  $scope.setAnswer = (tmpQstn, tmpAnswer) => {
		tmpQstn.user_answer = tmpAnswer;
	  };
	}
  }

  var drct = function(){
  	return {
  	  restrict: 'A', // only attribute
  	  templateUrl: 'quiz-item/qstn-item.tpl.html',
  	  scope: {
		// qstn
  		item: '='
  		//@ simply reads the value (one-way binding)
  	  },
  	  controller: [
  		'$scope',
  		Xpo
  	  ]
  	};
  };

  angular.module('myApp.qstnItemDrct', [])

	.directive('qstnItemDrct', [
	  drct
	]);


})(window.angular);
