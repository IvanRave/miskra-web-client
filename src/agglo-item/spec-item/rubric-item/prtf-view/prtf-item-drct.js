(function(angular){
  'use strict';
  
  var xpo = function($scope,
					 $location,
					 $state){
	
	$scope.saveHash = function(hashString){	  
	  $location.hash(hashString);
	};

	var linkOpts =  {
	  supplier_id:$scope.pw.master_profile_id,
	  name: $scope.pw.master_profile_name
	};

	$scope.workInfoLink = $state.href('byt.mediaItem', {
	  //supplier_id: $scope.pw.master_profile_id,
	  //serv_rubric_name: $scope.rubricName,
	  media_id: $scope.pw.id
	  //name: $scope.pw.master_profile_name
	});

	$scope.masterInfoLink = $state.href('byt.splrItem.main',
										linkOpts);
  };
  
  var drct = function(){
	
	return {
	  restrict: 'A', // only attribute
	  templateUrl: 'agglo-item/spec-item/rubric-item/prtf-view/prtf-item.tpl.html',
	  scope: {
		pw: '=', // same as '=pw'
		rubricName: '=' // rubric-name tag
	  },
	  controller: [
	  	'$scope',
	  	'$location',
		'$state',
	  	xpo
	  ]
	};
  };
  
  angular.module('myApp.prtfItemDrct', [
	'myApp.ytbVideo'
  ])

	.directive('prtfItemDrct', [
	  drct
	]);

})(window.angular);

// var linkFunc = function(scope, elems, attrs){
//   // first 8 records
//   if (attrs.index <= 7) {
// 	// todo: попробовать: показывать айтэм
// 	//   по событию display:block, а не по изменению скопа
// 	scope.is_viewed = true;
// 	return;
//   }

// scrollRepo.addListener(attrs.index, function(){
// 	if (hprFactory.isElemInViewport(elems[0], 200)){
// 	  scrollRepo.removeListener(attrs.index);
// 	  scope.is_viewed = true;
// 	  //console.log('removed listen', attrs.index, pos);
// 	}
// 	// delete from listeners, after image loading
// });
//};
