(function(angular){
  'use strict';

  var xpo = function($scope,
					 q_id,
					 q_tpe,
					 q_hash,
					 q_name){
	//q_tpe = q_tpe || 'tbl';

	$scope.splr = {
	  id: q_id,
	  name: q_name
	};

	//console.log('splr-item-ctrl', q_id, q_tpe, q_hash);
  };

  angular.module('myApp.SplrItemController', [
  ])
    .controller('SplrItemController', [
	  '$scope',
	  'q_id',
	  'q_tpe',
	  'q_hash',
	  'q_name',
      // injected from prev controller (like rubric_item)
      //'master_profile_id',
      xpo
    ]);

})(window.angular);
