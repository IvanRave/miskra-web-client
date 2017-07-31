(function(angular){
  'use strict';

  var fromCoordsToStr = function(tmpLng, tmpLat){
	return tmpLng.toString(10) + ',' + tmpLat.toString(10);
  };

  // parse it to coords
  // long,lat
  // -39.3245,-43.654234
  var parseLngLat = function(ll){
	if (!ll){
	  return null;
	}

	var arr = ll.split(',');

	if (!arr[0] || !arr[1]){
	  return null;
	}

	var intLng = parseFloat(arr[0]);
	if (intLng < -180 || intLng > 180){
	  return null;
	}

	var intLat = parseFloat(arr[1]);
	if (intLat < -90 || intLat > 90){
	  return null;
	}

	return {
	  lng: intLng,
	  lat: intLat
	};
  };

  var parseZoom = function(zoomStr){
	var intZoom = parseInt(zoomStr, 10);

	if (intZoom < 0 || intZoom > 18) {
	  return null;
	}

	return intZoom;
  };

  var checkEnough = function(prev_center, upd_center){
	// check params
	prev_center = prev_center || {};
	upd_center = upd_center || {};

    var delta = Math.max(
      Math.abs((upd_center.lng || 0) - (prev_center.lng || 0)),
      Math.abs((upd_center.lat || 0) - (prev_center.lat || 0)));

	// enough for update
	return delta >= 0.0015;
  };

  class Xpo {
	constructor($scope,
				$state,
				$q,
				readiness,
				hprFactory,
				aggloItemRepo,
				firmListRepo,
				servGroupRepo,
				q_ll,
				q_z,
				q_g,
				q_spec){

	  // do not load data for crawlers' requests
	  // it is disallowed for crawlers in robots.txt /map
	  if (typeof window.callPhantom === 'function') {
		// before any data loading: no overflow for 2gis limits
		readiness.serverError(new Error('forbiddenForCrawlers'));
		return;
	  } else {
		readiness.ok(`Карта мастеров и салонов красоты`,
	  				 `Местоположение, адреса и контактные данные мастеров и салонов красоты`);
	  }

	  servGroupRepo.retrieveData()
		.then(function(arr){
		  $scope.arr_serv_group = arr;
		});

	  $scope.q_spec = q_spec;

	  if (!q_spec){
		// show rubrics to select
		// or redirect to separated page
		return;
	  }

	  var calcAutoCoords = function(){
		return $q.when({
		  lng: 37.6,
		  lat: 55.75
		});
	  };

	  var calcCoords = function(llTemp, gTemp){
		if (llTemp){
		  var centerCoords = parseLngLat(llTemp);
		  if (centerCoords){
			return $q.when(centerCoords);
		  } else {
			llTemp = null;
			// next check-in
		  }
		}

		//else

		if (gTemp){
		  // auto define coords
		  // if inside a city - use it
		  // else - use center coords of a city
		  console.log('calcByG', gTemp);
		  return aggloItemRepo.retrieveByLocalName(gTemp)
			.then(function(tmpAgglo){
			  console.log('byLocalName', tmpAgglo);
			  return hprFactory.coordsFromWktPoint(tmpAgglo.centroid);
			})
			.catch(function(errAgglo){
			  if (errAgglo.status === 404){
				return calcAutoCoords();
			  } else {
				// notFound, or smth else
				console.log('errAgglo', errAgglo);
				return $q.reject(errAgglo);
			  }
			});
		}

		//else {

		// if (!q_ll && !q_g){
		// try to define auto coords
		// use it
		return calcAutoCoords();
	  };

	  // these coordinates
	  // - from url
	  // - autodefine + default
	  // - from city name from a url: center coords
	  //$scope.map_zoom = 14;
	  // $scope.map_center = {
	  // 	lat: 43.60789763655921,
	  // 	lng: 39.744629859924316
	  // };

	  calcCoords(q_ll, q_g)
		.then(function(tmpCenter){
		  $scope.startLng = tmpCenter.lng;
		  $scope.startLat = tmpCenter.lat;
		  $scope.startZoom = parseZoom(q_z) || 14;
		  //console.log('tmpCenter', tmpCenter);
		})
		.catch(function(errMap){
		  console.log('errMap', errMap);
		  $scope.errMap = {
			msg: "some error"
		  };
		});


	  var cbkMarker = function(markObj, val) {
		// var dscUrl = '/id' + val.id + '?tpe=map&hash=' + val['hash'] +
		// 	  '&name=' + val['name'];

		var dscUrl = '/fid' + val.id + '?tpe=map' +
			  '&hash=' + val['hash'] +
			  '&name=' + val['name'];
		//
		//onclick="window.fillMapItem(this, '${val.id}', '${val.hash}')"
		var dscBtn = `<a class="map-item__msg-link"
 href="${dscUrl}">карточка салона</a>`;

		var microCmnt = '';
		// microcomment: usually undefined,
		// or contain rubrics
		if (val.micro_comment){
		  // Микрокомментарий (70 символов), присутствует
		  // в выдаче только для рекламных фирм. Позволяет
		  // акцентировать внимание пользователя сервиса
		  // на определенной организации в общем списке,
		  // размещается под ее названием.
		  // Пример: Деревянные окна и оконные блоки под ключ.
		  microCmnt = '<div><span class="map-item__comment">' + val.micro_comment + '</span></div>';

		  if (val.fas_warning){
			// write it under micro_comment
			microCmnt += '<div><span class="map-item__warning">' +
			  val.fas_warning +
			  '</span></div>';

		  }

		  microCmnt += '</div>';
		}

		var dsc = '<div class="map-item">' +
			  '<div class="map-item__name"><strong>' + val.name + '</strong></div>' +
			  '<div class="map-item__dscr">' +
			  // '&#x2302;&nbsp;' +
			  val.address + '</div>' +
			  microCmnt +
			  //'<div>Метров: ' + val.dist + '</div>' +
			  // rubricSet + // move to full profile
			  '<div class="map-item__link-wrap">' + dscBtn + '</div>' +
			  '</div>';


		//  iconUrl: val.micro_comment ? 'img/marker-icon-purple.png' : 'img/marker-icon.png',
		//    var iconOptions = {
		//iconSize: [100,100]
		//  };
		// TODO: calc icon from rubrics
		//          iconUrl: val.micro_comment ? 'img/marker-icon-purple.png' : 'img/marker-icon.png',
		//          shadowUrl: 'img/marker-shadow.png'

		// iconSize: [50, 50],
		//shadowSize: [50, 64]
		// iconAnchor: [22, 94],
		// shadowAnchor: [4, 62]

		markObj[val.id] = {
		  lat: parseFloat(val.lat),
		  lng: parseFloat(val.lon),
		  // compileMessage: true,
		  message: dsc,
		  title: val.name + ' | ' + val.address
		  //  icon: iconOptions

		  // icon: {
		  //   type: 'extraMarker',
		  //   icon: 'fa-star',
		  //   color: '#f00',
		  //   prefix: 'fa',
		  //   shape: 'circle'
		  // }
		};
	  };

	  /**
	   * Arr - array from GIS
	   */
	  var arrToMarkers = function(arr) {
		// { m1: {lat..lng..}, m2:
		var markObj = {};
		angular.forEach(arr, angular.bind(null, cbkMarker, markObj));
		return markObj;
	  };


	  var cbkFirmList = function(r){
		$scope.mapMarkers = arrToMarkers(r.result);
		$scope.total = r.total;
	  };

	  // ll=37.6,55.75
	  $scope.mapMove = function(upd_lng,
								upd_lat,
								upd_zoom,
								prev_lng,
								prev_lat) {		// 	prev_zoom
		//var cntr = event.targetScope.center;
		//console.log('handleMove', upd_center, upd_zoom);
		$state.go("byt.map", {
		  ll: fromCoordsToStr(upd_lng, upd_lat),
		  z: upd_zoom,
		  g: null,
		  spec: q_spec
		}, {
		  // If true will broadcast $stateChangeStart
		  //    and $stateChangeSuccess events.
		  notify: false,
		  // update url and also replace last history record
		  location: 'replace'
		});

		if (upd_zoom < 14) {
		  console.log('zoom >= 14 required');
		  return;
		}

		// load new companies, if moved more than 100 meters
		var isEnough = checkEnough({
		  lng: prev_lng,
		  lat: prev_lat
		}, {
		  lng: upd_lng,
		  lat: upd_lat
		});

		console.log('isEnough', isEnough);

		if (!isEnough){
		  console.log('not enough space to load new data');
		  return;
		}

		firmListRepo.retrieveData(upd_lng,
								  upd_lat,
								  q_spec)
		  .then(cbkFirmList)
		  .catch(function(err){
			console.log('error', err);
			alert('Ошибка загрузки данных. Попробуйте позже');
		  });

		// calculate a city by coords
	  };

	}
  }

  angular.module('myApp.AppMapController', [
	'myApp.readiness',
	'myApp.lflMap',
	'myApp.hprFactory',
	'myApp.aggloItemRepo',
	'myApp.firmListRepo',
	'myApp.servGroupRepo'
  ])
	.controller('AppMapController', [
	  '$scope',
	  '$state',
	  '$q',
	  'readiness',
	  'hprFactory',
	  'aggloItemRepo',
	  'firmListRepo',
	  'servGroupRepo',
	  'q_ll',
	  'q_z',
	  'q_g',
	  'q_spec',
	  Xpo
	]);

})(window.angular);
