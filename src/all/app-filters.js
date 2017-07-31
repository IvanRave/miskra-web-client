(function(angular){
  'use strict';

  angular.module('myApp.appFilters', [])

	.filter('range', function(){
	  return function(input, total) {
		total = parseInt(total, 10);
		for (var i = 0; i < total; i += 1){
		  input.push(i);
		}
		return input;
	  };
	})
  	.filter('enclink', function(){
      return window.encodeURIComponent;
	});

})(window.angular);
