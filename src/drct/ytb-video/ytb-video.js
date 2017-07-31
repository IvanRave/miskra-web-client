(function(angular){
  'use strict';

  // any symbol, except ^"&?\/ and space
  var yidRegexp = /^[^"&?\/ ]{11}$/i;
  
  var drct = function(){	
	var linkFunc = function(scope, elems, attrs){

	  var yid = attrs.yid;
	  if (!yid) {
		console.log('required: yid');
		return;
	  }

 	  // check id format
	  if (yidRegexp.test(yid) === false){
		return;
	  }
	  
	  // $scope.ytbUrl = $sce.trustAsResourceUrl();
	  
	  var fr = document.createElement("iframe");

	  // || !attrs.ywidth || !attrs.yheight
	  // fr.width = +attrs.ywidth;
	  // fr.height = +attrs.yheight;
	  
	  fr.width = "100%";
	  fr.height = "100%";
	  fr.className = "full-height full-width";
	  fr.src = 'https://www.youtube.com/embed/' + yid + '?html5=1';
	  fr.frameBorder = 0;
	  fr.scrolling = "no";
	  // http://stackoverflow.com/questions/4800227/why-did-youtube-put-a-type-attribute-in-iframe-for-embedded-video
	  fr.setAttribute("type", "text/html");
	  fr.setAttribute("allowfullscreen", "");
	  // fr.onload = function(){
	  // 	console.log('onload');
	  // for IE
	  // http://stackoverflow.com/questions/1516803/how-to-remove-border-from-iframe-in-ie-using-javascript	  
	  //fr.contentWindow.document.body.style.border="none";
	  //};
	  
	  elems[0].appendChild(fr);
	};
	
	return {
	  restrict: 'A', // only attribute
	  link: linkFunc
	};
  };
  
  angular.module('myApp.ytbVideo', [])

	.directive('ytbVideo', [
	  drct
	]);

})(window.angular);

// <iframe class="youtube-player"
// 		type="text/html"
// 		width="200"
// 		height="200"
// 		ng-src="{{ytbUrl}}"
// 		frameborder="0">
// </iframe>
