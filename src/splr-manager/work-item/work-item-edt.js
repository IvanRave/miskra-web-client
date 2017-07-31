(function(angular){
  'use strict';
  
  // class Xpo{
  // 	constructor($scope, $sce){
  // 	}
  // }

    // actually it is a work_rubric (with serv_work inside)
  var drct = function(){

	var linkFunc = function(scope, elems){
	  var raw = elems[0];

	  //console.log('lf', raw.offsetTop);

	  scope.$watch('vpos.val', function(wrapScrollTop){
	  	if (!scope.is_show){
	  	  // console.log('vpos', wrapScrollTop);
	  	  if (raw.offsetTop > wrapScrollTop - 500 && raw.offsetTop < wrapScrollTop + 1000) {
	  		// show (load) image
	  		scope.is_show = true;
	  	  }
	  	}
	  	//console.log('newpos', wrapScrollTop, raw.offsetTop);
	  });
	};
	
	return {
	  restrict: 'A',
	  scope: {
		servWork: '=',
		vpos: '='
	  },
	  templateUrl: 'splr-manager/work-item/work-item-edt.tpl.html',
	  // controller: [
	  // 	'$scope',
	  // 	'$sce',
	  // 	Xpo
	  // ],
	  link: linkFunc
	};
  };

  angular.module('myApp.workItemEdt', [
	// 'myApp.apimas'
	'myApp.ytbVideo'
  ])
	.directive('workItemEdt', [
	  drct
	]);

  
})(window.angular);
