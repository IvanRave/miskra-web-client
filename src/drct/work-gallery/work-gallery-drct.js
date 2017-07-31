(function(angular){
  'use strict';

  var xpo = function($scope){
	$scope.stateShow = {
	  val: false
	};

	$scope.switchNext = function(){
	  $scope.stateShow.val = true;
	};
  };
  
  var drct = function(){
	return {
	  restrict: 'A', // only attribute
	  templateUrl: 'drct/work-gallery/work-gallery.tpl.html',
	  scope: {
		supItem: '=appSupItem',
		workScope: '=appWorkScope',
		wrapElemId: '=appWrapElemId'
	  },
	  controller: [
		'$scope',
		xpo
	  ]
	};
  };
  
  angular.module('myApp.appWorkGallery', [
	'myApp.appGalleryItem',
	'myApp.ytbVideo'
  ])

	.directive('appWorkGallery', [
	  drct
	]);

})(window.angular);
