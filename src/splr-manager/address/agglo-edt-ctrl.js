(function(angular){
  'use strict';

  var createFilterFor = function(query){
	var lowercaseQuery = angular.lowercase(query);
	return function(elem) {
	  return (elem.local_name.toLowerCase().indexOf(lowercaseQuery) >= 0);
	};
  };

  // data: {
  //   ttl: 'Адрес - редактирование',
  //   dscr: 'Редактирование адреса мастера или салона красоты: выбор города, района, указание адреса, как пройти, проехать, выбор районов работы на выезде'
  // }
  var xpo  = function($scope,
					  geoRegionRepo,
					  geoAggloRepo) {
	// geoHelper
	// $scope.supplier from a parent
	if (!$scope.supplier){
	  console.log('no $scope.supplier');
	  alert('Непредвиденная ошибка');
	  return;
	}

	var mdr = $scope.supplier.master_address;
	
	if (!mdr){
	  console.log('no master_address aggglo_edt');
	  alert('Непредвиденная ошибка');
	  return;
	}

	$scope.slc_data = {
	  agglo_item: null,
	  agglo_id: ""
	  
	  //search_text: ''
	  // must be undefined to show menu by point
	};
	
	$scope.querySearch = function(arr, query){	  
	  if (!query){
		return arr;
	  }
	  
	  return arr.filter(createFilterFor(query));
	};	
	
	$scope.onSelectedItemChange = function(tmpAggloId){

	  console.log(tmpAggloId);
	  //masterAddress.geo_district_id = aggloId;

	  // if not selected - ""
	  if (tmpAggloId){
		// from string to int
		mdr.geo_district_id = parseInt(tmpAggloId);
		console.log('changed', mdr);
	  } else {
		mdr.geo_district_id = null;
	  }
	  
	  //console.log($scope.supplier.master_address);
	  // save it
	  // console.log('slc_agglo');
	  // console.log(tmpSlcAgglo);
	  // console.log('scope slc_agglo');
	  // console.log($scope.slc_data.agglo_item, tmpSlcAgglo);
	};

	// geoRegionRepo.retrieveData()
	//   .then(function(allGeoRegions){
	// 	console.log('loaded geo regions');
	// 	$scope.calcCityRegions = function(tmpGeoDistrictId){
	// 	  return geoHelper.getRegionsByCity(allGeoRegions, tmpGeoDistrictId);		 
	// 	};
	//   });

	geoAggloRepo.retrieveData()
	  .then(function(arrGeoAgglo){
		$scope.arr_geo_agglo = arrGeoAgglo;

		if (mdr.geo_district_id){
		  $scope.slc_data.agglo_id = "" + mdr.geo_district_id;
		  // //$scope.slc_data.agglo_item = slcAgglo;
		  // $scope.slc_data.agglo_inter_code = slcAgglo.inter_code;
		  //"" + mdr.geo_district_id;
		}		
	  });
  };

  angular.module('myApp.SplrAggloEdtController', [
	'myApp.addressEdtDrct',
	'myApp.geoRegionRepo',
	'myApp.geoAggloRepo'
	//	'myApp.geoHelper'
  ])
	.controller('SplrAggloEdtController', [
	  '$scope',
	  'geoRegionRepo',
	  'geoAggloRepo',
	  //	  'geoHelper',
	  xpo]);
  
})(window.angular);
