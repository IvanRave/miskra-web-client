(function(angular){
  'use strict';

  class Xpo{
	constructor($scope,
				$state,
				readiness,
				quizSrvc,
				quiz_ttl){

	  var quizRelUrl = $state.href("byt.quizItem.qstnList");

	  var cbkCatch = (err) => {
		console.log(err);
		var errmsg = '';
		if (err.status === 404){
		  errmsg = 'Тест не найден';
		  readiness.notFound();
		} else {
		  errmsg = 'Ошибка загрузки теста: повторите запрос позже';
		  readiness.serverError(err);
		}

		$scope.quizErr = errmsg;
	  };

	  var cbkSuccess = (qz) => {
		// // get it from hash: already answered
		// // or store it right in main directive (no hash or url)
		// qz.pans = [];
		//quizHelper.fromStrToAnsw(quiz_answers);
		qz.ttl = qz.ttl[0].charAt(0).toUpperCase() + qz.ttl.slice(1);
		qz.dscr = 'В результате теста - краткие рекомендации, как выбрать подходящую причёску или стрижку: что вам подойдёт, а чего следует избегать.';

		qz.rel_url = quizRelUrl;
		// стрижки подходящие 11к
		// подходящая прическа 11к

		$scope.quizItem = qz;
		// it is abstract view

		// move ok to quizItem directive
		// readiness.ok('Test ', 'wow');
	  };

	  quiz_ttl = quiz_ttl.replace(/-/g, ' ');

	  quizSrvc.getItem(quiz_ttl)
		.then(cbkSuccess)
		.catch(cbkCatch);
	}
  }

  angular.module('myApp.QuizItemController', [
	'myApp.quizSrvc',
	'myApp.readiness'
  ])
	.controller('QuizItemController', [
	  '$scope',
	  '$state',
	  'readiness',
	  'quizSrvc',
	  'quiz_ttl',
	  //	  'quiz_answers',
	  Xpo
	]);

})(window.angular);


// quizSrvc.getSuites()
// 	.then((arr) => $scope.suites = arr);

// attach pass_answers (states) to a quiz
// console.log('qparams', q_params);

// parse answers to pans

// calculate qa
// find all possible questions from qz
// remove unneeded qparams
// find for every question - possible answers
// remove unneeded qparams
// send qparams as a UserPass to drct

// user_pass is not in suitable for this situation
// use pass_answers only withot binding to user_pass

// pans are depends of a quiz through qa
// but a quiz can exists without pans (states)

// but pans can not exists without a quiz
// attach to qz

// pass answers

// var quiz_answers = '';

//console.log('quizSrvc', quizSrvc);
