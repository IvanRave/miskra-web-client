(function(angular, SNNS){
  'use strict';

  class Xpo{
	constructor($scope){

      /**
       * Whether to show a button 'add to a left link'
       * - and there is a method to add it
       * - and there is a method to check a link
       * - if no left links yet
       * @type {boolean}
       */
	  $scope.is_show = !!(SNNS.showLeftLinkBox) &&
        !!(SNNS.isLeftLink) &&
        !SNNS.isLeftLink();

	  $scope.showLeftLinkBox = function(){
		if (!$scope.is_show){
		  return;
		}

		SNNS.showLeftLinkBox();
        // if a user changes permissions, isLeftLink() will be changed too
		// hide: no need again
		// SNNS.is_left_link = true; // no such property already
		// re-calculate manually (no auto for non-angular props)
		$scope.is_show = false;
	  };
	}
  }

  var drct = function(){
	return {
	  restrict: 'A',
	  templateUrl: 'drct/left-link.tpl.html',
	  controller: [
		'$scope',
		Xpo
	  ]
	};
  };

  angular.module('myApp.leftLinkDrct', [])
	.directive('leftLinkDrct', [
	  drct
	]);

})(window.angular, window.snns);
