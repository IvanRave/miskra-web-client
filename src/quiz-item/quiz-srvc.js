// first - make sharing of text
// add title: pricheski for long faces and red hairs
// second - generate and add an image
// move to the server
// hide how to response generated
// show some delays between responses
// or load all answers at once
// web admin to edit tests
// use separated quiz_app, on nodejs or go
// use mongodb or similar db
// our admin panel allows to use some selectboxes, etc.
// no need to extract as svc everytime and update it manually
//   or using hard-configurable system to export it and insert to db

(function(angular, APPCONF){
  'use strict';

  // для неполных наборов - какой результат выбирать,
  // если есть набор для faceform_oval
  // и отдельный набор для haircolor_red?
  // любой!

  var cacheQuiz = {};

  var cacheQres = {};

  var xpo = function($q, $http) {
	//var apiqHost = 'https://localhost:2222/v1';
	//'https://apiq.miskra.ru/v1';

	return {
	  getItem: function(ttl) {
		if (cacheQuiz[ttl]){
		  return $q.when(cacheQuiz[ttl]);
		}

		return $http({
		  method: "GET",
		  url: APPCONF.QUIZ_ENDPOINT + '/quiz/get-full-by-title',
		  // headers: {
		  //   'Authorization': 'super key'
		  // },
		  params: {
			ttl: ttl
		  }
		  //cache: apimasCache
		})
		  .then(function(r){
			cacheQuiz[ttl] = r.data;
			return r.data;
		  });
		//.then((r) => r.data);
		// send a request to apiq: apiq.miskra.ru

		// itemId
		// var qz = repoData.quizList.filter((quizItem) => quizItem.id === quizId)[0];
		// if (qz) {
		//   return $q.when(qz);
		// } else {
		//   return $q.reject(new Error('notFound'));
		// }
	  },
	  getQres: function(id){
		if (cacheQres[id]){
		  return $q.when(cacheQres[id]);
		}
		var qresEndpoint = APPCONF.QUIZ_ENDPOINT + '/qres/get-item';
		return $http({
		  method: "GET",
		  url: qresEndpoint,
		  params: {
			id: id
		  }
		})
		  .then(r => r.data)
		  .then((dta) => {
			cacheQres[id] = dta;
			return dta;
		  });
	  },
	  calcQres: function(answerIds){
		var qresEndpoint = APPCONF.QUIZ_ENDPOINT + '/qres/calc-item';
		return $http({
		  method: "GET",
		  url: qresEndpoint,
		  params: {
			// haircolor_red-faceform_oval-...
			answers: answerIds.join('-')
		  }
		  //cache: apimasCache
		})
		  .then(r => r.data)
		  .then((dta) => {
			cacheQres[dta.id] = dta;
			return dta;
		  });

		// todo: calc from qresEndpoint (not from helper)
		// var qres = quizHelper.calcResult(suites,
		// 								 answerIds);
		// if (!qres){
		//   return $q.reject(new Error('no qres'));
		// } else {
	  	//   return $q.when(qres);
		// }
	  }
	};
  };

  angular.module('myApp.quizSrvc', [])

	.factory('quizSrvc', [
	  '$q',
	  '$http',
	  xpo]);

})(window.angular, window.APPCONF);

