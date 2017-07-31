(function(angular){
  'use strict';

  // class Xpo{
  // 	constructor($scope){

  // 	}
  // }

  var drct = function(apimas){
	var linkFunc = function(scope, elem, attrs){
	  var raw = elem[0];
	  //console.log(elem.parent().width());
	  // console.log(elem);
	  // console.log(raw);
	  // console.log(attrs);

	  var block;
	  if (document.createElement("detect").style.objectFit === "") {
		block = document.createElement('img');

		if (attrs.workId){
		  block.onerror = function(ev){
			// disable next onerror:
			//   in cases where this function is failed
			block.onerror = null;
			// console.log('img err');
			// console.log(err);
			console.log('img err', ev);

			// no need to handle a response (error or no)
			apimas.sendReportNoImage({ id: attrs.workId });
			// send a report to a server
		  };
		}
		block.src = attrs.imgSrc;
	  } else {
		block = document.createElement('div');
		block.style.backgroundImage = 'url(' + attrs.imgSrc + ')';
	  }

	  raw.appendChild(block);
	};


	return {
	  restrict: 'A',
	  link: linkFunc
	  // scope: {
	  // 	item: '='
	  // },
	  //templateUrl: '',
	  // controller: [
	  // 	'$scope',
	  // 	Xpo
	  // ]
	};
  };

  angular.module('myApp.fullSizeImg', [
	'myApp.apimas'
  ])
	.directive('fullSizeImg', [
	  'apimas',
	  drct
	]);

})(window.angular);
