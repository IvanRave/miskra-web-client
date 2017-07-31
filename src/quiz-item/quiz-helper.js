(function(angular){
  'use strict';

  // select all variants and cons-variants
  // remove cons variants from pros
  // [{id:'hairform', answers: []...},]
  // [{q:'hairform', a:'thick'},]
  // it may be intermediate result
  //   not necessary to existence of all pass_answers

  var calcNextQuestion = (questions, pans) => {
	// ['faceform', 'hairform']
	// already answered
	var pansQuestionsIds = pans.map(pan => pan.q);

	var cbkQstn = (question) => {
	  return pansQuestionsIds.indexOf(question.id) === -1;
	};

	// [{q1}, {q3}]
    var openedQuestions = questions.filter(cbkQstn);

	// TODO: return using sorting by id or ttl
	return openedQuestions[0];
  };

  var xpo = function(){
	return {
	  toUrlParams: function(data){
  		return Object.keys(data).map(function(k) {
  		  return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
  		}).join('&');
	  },
	  // from asdf-zxcv_qert-bzx to obj
	  fromStrToAnsw: function(str){
		if (!str){
		  return [];
		}

		// faceform_oval-bodyform_normal
		return str.split('-').map(function(pair){
		  var qa = pair.split('_');
		  return {
			q: qa[0],
			a: pair
			// qa[1]
		  };
		});
	  },
	  fromAnswToStr: function(arr){
		var pairs = arr.map(function(pan){
		  //return pan.q + '-' + pan.a;
		  // faceform_oval
		  return pan.a;
		});

		//console.log('pairs', pairs);
		return pairs.join('-');
	  },
	  calcNextQuestion: calcNextQuestion
	};
  };

  angular.module('myApp.quizHelper', [])
	.factory('quizHelper', [
	  xpo
	]);

})(window.angular);
