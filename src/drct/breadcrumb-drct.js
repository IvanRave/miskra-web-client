(function(angular){
  'use strict';

  class Xpo{
	constructor($scope, $state){
	  $scope.hrefHome = $state.href("byt.welcome");

	  $scope.calcHrefAgglo = (aggloName) => $state.href("byt.aggloItem.specList", {
		agglo_local_name: aggloName
	  });

	  $scope.calcHrefSpec = (aggloName, specName) => $state.href("byt.aggloItem.specItem.rubricList", {
		agglo_local_name: aggloName,
		spec_name: specName
	  });

	  $scope.calcHrefSplr = (splrId, splrName) => $state.href("byt.splrItem", {
		supplier_id: splrId,
		name: splrName
	  });

	  $scope.calcHrefRubric = (aggloName, specName, rubricName, rviewId) => $state.href("byt.aggloItem.specItem.rubricItem." + rviewId + "View", {
	  	agglo_local_name: aggloName,
		spec_name: specName,
		rubric_name: rubricName
	  });
	}
  }

  var linkFunc = function(scope, elems){ // attrs
	var wrap = elems[0];
	console.log('wrap', wrap);
	// scrollWidth = readonly
	// if there are scroll bars for scrolling through the content), the scrollWidth is larger than the clientWidth.
	console.log('scroll', wrap.scrollWidth, wrap.scrollLeft);
	window.setTimeout(function(){
	  wrap.scrollLeft = wrap.scrollWidth;
	}, 100);
	//elems[0].scrollWidth;

	//console.log('scroll', elems[0].scrollWidth, elems[0].scrollLeft);
  };


  var drct = function(){
	return {
	  restrict: 'A',
	  scope: {
		aggloName: '=',
		specName: '=',
		rubricName: '=',
		rviewId: '=',
		rviewName: '=',
		splrId: '=',
		splrName: '='
	  },
	  templateUrl: 'drct/breadcrumb.tpl.html',
	  controller: [
		'$scope',
		'$state',
		Xpo
	  ],
	  link: linkFunc
	};
  };

  angular.module('myApp.breadcrumbDrct', [])
	.directive('breadcrumbDrct', [
	  drct
	]);

})(window.angular);
