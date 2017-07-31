(function(angular){
  'use strict';

  // var parentEl = angular.element(document.body);
  
  var xpo = function($scope,
					 $location){	
	
	$scope.saveHash = function(hashString){	  
	  $location.hash(hashString);
	  
	  // a scroll position in pixels, like 120px is not fit
	  // user can change a size of a screen (maximize, minimize)
	  // and a scroll can be changed
	  // document.documentElement.scrollTop || document.body.scrollTop);
	};
  };
  
  var drct = function(){

	
	return {
	  restrict: 'A', // only attribute
	  templateUrl: 'drct/tbl-item/tbl-item.tpl.html',
	  scope: {
		cityName: '=',
		supItem: '=', // same as '=supItem'
		//retrieveFunc: '&'
		isEditable: '='
	  },
	  controller: [
		'$scope',
		'$location',
		xpo
	  ]
	};
  };
  
  angular.module('myApp.appTblItem', [])

	.directive('appTblItem', [
	  drct
	]);

})(window.angular);

// 	$scope.showFullWork = function(ev, curIndex, allWorks){
// 	  $mdDialog.show({
// 		clickOutsideToClose: true,
// 		//preserveScope: true,
// 		parent: parentEl,
// 		controller: '',
// 		templateUrl: '',
// 		// hide dialog in this ev.point (animation)
// 		targetEvent: ev, 
// 		locals: {
// 		  reqOpts: {
// 			cur_index: curIndex,
// 			arr_serv_work: allWorks
// 		  }
// 		}
//     });
// 	  // console.log(curIndex);
// 	  // console.log(allWorks);
// 	};
