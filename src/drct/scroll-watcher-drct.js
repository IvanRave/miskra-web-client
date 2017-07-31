(function(angular){
  'use strict';

  var drct = function ($compile, $location) {

	var linkFunc = function(scope, elem) { // , attrs

	  var raw = elem[0];

	  // set focus to use page down, page up

	  elem.bind('scroll', function(){
		// fix for smooth scrolling (1px interval)
		// execute it with some interval: 30px
		// usually: bottom/up arrow executes approx 40px
		if (Math.abs(scope.vpos.val - raw.scrollTop) > 30){
		  //console.log('scroll fired', raw.scrollTop);
	  	  scope.vpos.val = raw.scrollTop;
		  scope.$apply();
		}
		return true;
	  });

      /**
       * Scroll to the top of the window
       */
	  scope.scrollToStart = function(){
	  	//console.log('scroll to start');
		$location.hash('');
		scope.vpos.val = 1;
		// alternative
	  	// raw.scrollTop = 0;
	  	// it executes elem.bind('scroll')
	  };

	  // scrollTop of wrap assigned only here
	  scope.$watch('vpos.val', function(tmpVal){
		//console.log('directive vpos', tmpVal);
		raw.scrollTop = tmpVal;
		raw.focus();
	  });

	  var btnTop = angular.element(`
  <div class="scroll-top-wrap" ng-show="vpos.val > 300">
	<button ng-click="scrollToStart()"
			title="наверх"
			class="app-button scroll-top-btn"
			analytics-on
			analytics-category="scroll"
			analytics-event="scroll-top">
	  <span class="fa fa-arrow-up fa-2x">
	  </span>
	</button>
  </div>`);

	  $compile(btnTop)(scope);
	  elem.append(btnTop);
	};

	return {
	  restrict: 'A',
	  link: linkFunc,
	  scope: {
		vpos: '=appVpos'
	  }
	};

  };

  angular.module('myApp.appScrollWatcher', [])
	.directive("appScrollWatcher", [
	  '$compile',
	  '$location',
	  drct
	]);

})(window.angular);

// 	angular.element($window).bind("scroll",
// function(){
// 	  if (this.pageYOffset >= 100) {
// 	    scope.boolChangeClass = true;
// 	    console.log('Scrolled below header.');
// 	  } else {
// 	    scope.boolChangeClass = false;
// 	    console.log('Header is in view.');
// 	  }
// 	  scope.$apply();
// 	});

