(function(angular){
  'use strict';
  
  var drct = function(){
	return {
	  restrict: 'A',
	  templateUrl: 'agglo-item/spec-item/rubric-item/blog-links.tpl.html',
	  scope: {
		rubricArticles: '='
	  }
	};
  };
  
  angular.module('myApp.appBlogLinks', [])
	.directive('appBlogLinks', [
	  drct
	]);
  
})(window.angular);
