(function(angular, APPCONF){
  'use strict';


  class Xpo {
	constructor($scope,
				$state,
				readiness,
				quizSrvc){

	  $scope.url_to_share = APPCONF.MAIN_HOST + $state.href("byt.quizItem.questionList");

	  $scope.calcAnswerIds = function(tmpQuiz){
		var answerIds = [];

		angular.forEach(tmpQuiz.question_list, (qu) => {
		  if (qu.user_answer){
			answerIds.push(qu.user_answer.id);
		  }
		});

		return answerIds;
	  };

	  $scope.calcResult = function(tmpQuiz){
		var answerIds = $scope.calcAnswerIds(tmpQuiz);

		if (answerIds.length !== tmpQuiz.question_list.length){
		  console.log('required all answers');
		  return;
		}

		quizSrvc.calcQres(answerIds)
		  .then(function(quiz_result){
			$scope.qresItem = quiz_result;
			//console.log('quiz_result', quiz_result);
			// $state.go("byt.quizItem.qresItem", {
			//   qres_id: quiz_result.id
			// });
			//$scope.quiz_result = quiz_result;
		  })
		  .catch(function(err){
			console.log(err);
			alert('Непредвиденная ошибка: не удалось вычислить результат: попробуйте позже');
		  });
	  };


	  // init
	  // all questions already loaded in a parent controller
	  readiness.ok('Тест: ' + $scope.quizItem.ttl,
				   $scope.quizItem.dscr,
				   $scope.quizItem.rel_url);

	}
  }

  var drct = () => ({
	restrict: 'A', // only attribute
	templateUrl: 'quiz-item/qstn-list.tpl.html',
	scope: {
	  quizItem: '='
	  //suites: '='
	  //@ simply reads the value (one-way binding)
	},
	controller: [
	  '$scope',
	  '$state',
	  'readiness',
	  'quizSrvc',
	  // '$location',
	  Xpo
	]
  });

  angular.module('myApp.qstnListDrct', [
	'myApp.qstnItemDrct',
	'myApp.qresItemDrct',
	'myApp.quizSrvc',
	'myApp.appCommentForm',
	'myApp.readiness'
  ])
	.directive('qstnListDrct', [
	  drct
	]);

})(window.angular, window.APPCONF);


// $scope.answered_questions = [];
// $scope.unanswered_questions = [];

// if (qstn){
// 	console.log('here is a qstn', qstn);
// 	$scope.qstn = qstn;
// 	readiness.ok(qstn.ttl + ' - ' + quiz.ttl,
// 				 'Вопрос - ' + qstn.ttl + ' - ' + quiz.ttl);
// } else {


// nextQ and qResults depends of each other, but only
// in business logic, and not programmatically


//var quiz = $scope.item;
//console.log('quiz-drct',  quiz);
