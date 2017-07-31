(function(angular){
  'use strict';

  var xpo = function($scope,
					 $timeout,
					 apimas){
	// geoRegionRepo,
	// 				 geoHelper
	
	// $scope.clearSupRegion = function(gggNew){
	//   gggNew.supRegion = undefined;
	// };

	// $scope.selectAll = function(tmpGeoRegionList){
	//   angular.forEach(tmpGeoRegionList, function(rgn){
	// 	rgn.is_selected = true;
	//   });
	// };

	// $scope.unselectAll = function(tmpGeoRegionList){
	//   angular.forEach(tmpGeoRegionList, function(rgn){
	// 	rgn.is_selected = false;
	//   });
	// };	
	
	// if (!$scope.mdr || !$scope.mdr.geo_district_id){
	//   console.log('no mdr or gid');
	//   return;
	// }
	
	// master_address.description cannot be changed selfly
	// only using a method from ModelToStr

	var cbkFail = function(r){
	  switch (r.status){
	  case 422:
 		alert('Ошибка ввода: ' +
			  JSON.stringify(r.data));
		break;
	  default:
		alert('Непредвиденная ошибка. Не удалось сохранить. Попробуйте позже');
	  }
	  console.log(r);
	};
	
	var cbkSuccess = function(r){
	  console.log(r);
	  $scope.is_saved = true;
	  $timeout(function(){
		$scope.is_saved = false;
	  }, 1500);
	};


	$scope.updateAddress = function(maNew,
									gggNew){
	  $scope.update_progress = true;
	  console.log(gggNew);

	  gggNew.cusRegions = [];
	  //calcSlcRegionNames(tmpGeoRegionList);
	  
	  maNew.description = JSON.stringify(gggNew);

	  console.log(maNew);
	  
	  apimas.sendPost('/master/upsert-address', maNew)
	  	.then(cbkSuccess) // 2xx, 3xx codes
	  	.catch(cbkFail) // 4xx, 5xx codes
	  	.finally(function(){
	  	  $scope.update_progress = false;
	  	});
	};
	
	try {
	  $scope.ggg = JSON.parse($scope.mdrDescription || '{}');
	}
	catch (excParse){
	  console.log(excParse);
	  $scope.ggg = {};
	}
  };
  
  var drct = function(){
	return {
	  restrict: 'A', // only attribute
	  templateUrl: 'splr-manager/address/address-edt.tpl.html',
	  scope: {
		mdrDescription: '=',
		mdrGeoDistrictId: '=',
		mdr: '='
		// calc aggloItem from mdr.geo_distric_id
	  	//aggloItem: '=' // same as '=aggloItem'
	  },
	  controller: [
		'$scope', // non-inherited
		'$timeout',
		'apimas',
		// 'geoRegionRepo',
		// 'geoHelper',
		// '$location',
		// '$mdDialog',
		// 'splrAddressHelper',
		xpo
	  ]
	  // link: linkFunc
	};
  };

  angular.module('myApp.addressEdtDrct', [
	'myApp.apimas',
	// 'myApp.geoRegionRepo',
	// 'myApp.geoHelper'
  ])

	.directive('addressEdtDrct',[
	  drct
	]);
  
})(window.angular);


//console.log(str);
// if (!obj){
//   console.log('no obj.sup or obj.cus');
//   result.sup = {};
//   result.cus = {};
// }
// else {
//   result.sup = {
// 	region: obj.sup.region,
// 	street: obj.sup.street,
// 	comment: obj.sup.comment
//   };

//   result.cus = {
// 	conds: obj.cus.conds
//   };
//   // result.supGeoRegionId = obj.sup.region;
//   // result.supStreet = obj.sup.street;
//   // result.supComment = obj.sup.comment;
//   // result.cusConds = obj.cus.conds;
// }
// if (!$scope.aggloItem){
//   console.log('aggloItem must be initialized in a parent view');
//   return;
// }

// if ($scope.aggloItem.id !== supplier.master_address.geo_district_id) {
//   console.log('not equal');
// }

// if (!supplier.master_address){
//   //supplier.master_address = {};
//   console.log('no master_address');
//   return;
// }

// var calcCityRegions = function(tmpGeoDistrictId){
//   return geoHelper.getRegionsByCity($scope.arr_geo_region, tmpGeoDistrictId);
// };

// $scope.calcRegList = function(tmpGeoDistrictId){
//   var cityRegions = calcCityRegions(tmpGeoDistrictId);

//   var regList = gnrtGeoRegionList(
// 	$scope.ggg.cusRegions || [],
// 	cityRegions);
//   return regList;
// };

// geoRegionRepo.retrieveData()
//   .then(function(arrGeoRegion){
// 	console.log('arrgeoregion', arrGeoRegion);
// 	$scope.arr_geo_region = arrGeoRegion;


//   });

// var gnrtGeoRegionList = function(arrCusRegionName,
// 								   arrGlbRegion){

// 	console.log('gnrtGeoRegion', arrGlbRegion);
// 	if (!arrCusRegionName){
// 	  return [];
// 	}
// 	var tmpList = [];

// 	// select regions
// 	var handleRegion = function(glbRegion){
// 	  // copy object: to use other params
// 	  var rgnObj = {
// 		id: glbRegion.id,
// 		name: glbRegion.name
// 	  };

// 	  rgnObj.is_selected =
// 	  	arrCusRegionName.indexOf(rgnObj.name) >= 0;

// 	  tmpList.push(rgnObj);
// 	};

// 	angular.forEach(arrGlbRegion, handleRegion);

// 	return tmpList;
// 	// add a property to result with selected regions
// 	// return as a separated property
// };

  // var calcSlcRegionNames = function(tmpGeoRegionList){
  // 	var filtered = tmpGeoRegionList.filter(function(rgn){
  // 	  return rgn.is_selected === true;
  // 	});
	
  // 	return filtered.map(function(rgn){
  // 	  return rgn.name;
  // 	});	
  // };
