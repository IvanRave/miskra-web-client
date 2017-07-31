(function(angular){
  'use strict';

  class Xpo{
	constructor($scope, $state){
	  $scope.calcAggloHref = function(aggloLocalName){
		// var myState = $state.get("byt.aggloItem.specList");
		// console.log(myState);

		return $state.href("byt.aggloItem.specList", {
		  agglo_local_name: aggloLocalName
		});
	  	//ui-sref="byt.aggloItem.specList({agglo_local_name:'asdf zxvv'})">
	  };
	}
  }

  var drct = function(){
	return {
	  restrict: 'A',
	  scope: {
		arrGeoAgglo: '='
	  },
	  templateUrl: 'agglo-list/agglo-list-drct.tpl.html',
	  controller: [
		'$scope',
		'$state',
		Xpo
	  ]
	};
  };

  angular.module('myApp.aggloListDrct', [])
	.directive('aggloListDrct', [
	  drct
	]);

})(window.angular);
