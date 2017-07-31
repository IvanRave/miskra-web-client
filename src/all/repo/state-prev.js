(function(angular){
  'use strict';

  var statePrev = {
	url: ''
	// params
	// time
	// etc.
  };
  
  var xpo = function(){
	return statePrev;
  };
  
  angular.module('myApp.statePrev', [])

	.factory('statePrev', [
	  xpo
	]);
  
})(window.angular);
