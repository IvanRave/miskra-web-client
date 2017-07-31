(function(angular, SNNS, APPCONF){
  'use strict';

  class Xpo{
	// qstn_id - is a set of previous answers
	constructor($scope, hprFactory){

	  $scope.url_share = APPCONF.MAIN_HOST + hprFactory.encodePath($scope.quizItem.rel_url);

	  $scope.image_share = APPCONF.MAIN_HOST + '/qimg/' + $scope.qresItem.photo + '.png';

	  $scope.isWallPostQres = !!(SNNS.wallPost);

	  $scope.wallPostQres = function(qresItem){
		if (!$scope.isWallPostQres){
		  return;
		}

		// build message

		var msg = '';

		var attch = '';

		if (qresItem.photo){
		  attch = qresItem.photo;
		}

		// msg = $scope.quizItem.ttl +
		// 	'\n' +
		// 	'\n' + qresItem.best +
		// 	'\n' + qresItem.worst +
		// 	'\n\n';
		// attch = 'photo-92002771_391408538';

		// Пользователи приложения ВКонтакте - на десктопах
		// Их друзья могут быть как на десктопах, так и на мобилах
		// Мобилы не поддерживают приложения
		// Данная ссылка только для десктопов и планшетов
		// На мобилах можно только лайкать
		msg += 'Пройти тест в приложении vk.com/app4863471 либо на сайте miskra.ru';

		//attch += ',https://miskra.ru';
		//attch += ',https://vk.com/app4863471';
		// no link - use a link in a message

		// link to app only for desktop users
		// use a link to site
		// but users prefer vk, than side links
		// attach image too
		SNNS.wallPost(msg,
					  attch,
					  function(err, postId){
						// it is side library: need to re-scope
						if (err){
						  // it is a string
						  if (err.message === '10007'){
							// skip it
							//   error_msg: "Operation denied by user"
						  } else {
							alert('Возникла ошибка при сохранении. Повторите позже');
						  }
						  console.log(err);
						  return;
						}
						console.log(postId);
						// hide a button
						alert('Результат успешно сохранён на вашей стене.');
					  });
		// no attachmentUrl
		//console.log('posted', msg);
	  };

	  // var catchQres = function(err){
	  // 	console.log(err);
	  // 	$scope.qresErr = {
	  // 	  msg: 'Непредвиденная ошибка: повторите запрос позже'
	  // 	};
	  // 	readiness.serverError(err);
	  // };

	  // quizSrvc.getQres($scope.qresId)
	  // 	.then((qres) => {
	  // 	  $scope.item = qres;
	  // 	  readiness.ok('Результат №' + qres.id + ' теста: ' + $scope.quizItem.ttl,
	  // 				   'Результат №' + qres.id + ': ' + qres.best.substring(0, 126) + '...');
	  // 	})
	  // 	.catch(catchQres);
	}
  }

  var drct = function(){
  	return {
  	  restrict: 'A', // only attribute
  	  templateUrl: 'quiz-item/qres-item.tpl.html',
  	  scope: {
		quizItem: '=',
  		qresItem: '='
  	  },
  	  controller: [
  		'$scope',
		'hprFactory',
  		Xpo
  	  ]
  	};
  };

  angular.module('myApp.qresItemDrct', [
	'myApp.appShareBlock',
	'myApp.quizHelper',
	'myApp.hprFactory'
  ])

	.directive('qresItemDrct', [
	  drct
	]);


})(window.angular, window.snns, window.APPCONF);


// $location,
// $state,
// quizHelper

//console.log('qres-drct', $scope.suites);

// $scope.calcProductDscr = function(productTtl){

// 	var productItem = $scope.products.filter((prd) => {
// 	  return prd.ttl === productTtl;
// 	})[0];

// 	if (productItem){
// 	  return productItem.dscr;
// 	} else {
// 	  // no item or description
// 	  return '';
// 	}
// };
