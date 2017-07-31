// analytics-on
// analytics-category="locdef"
// analytics-event="locdef-manual">

(function(angular, lytic){
  'use strict';

  var drct = function(){

	// https://github.com/angulartics/angulartics/blob/master/src/angulartics.js
	var linkFunc = function(scope, elems, attrs){
	  // 'click' by default
	  var eventType = attrs.analyticsOn || 'click';

	  //console.log('andrct', eventType);

	  var cbkBind = function () { //$event
		// var props = {
		//   eventType: $event.type
		// };

		// $analytics.eventTrack(eventName, trackingData);
		lytic.trackEvent(attrs.analyticsEvent || 'no-action',
						 attrs.analyticsCategory || 'no-category',
						 {});
	  };

	  angular.element(elems[0]).bind(eventType, cbkBind);
	};

	return {
	  restrict: 'A',
	  link: linkFunc
	};
  };

  angular.module('myApp.analyticsOn', [])
	.directive('analyticsOn', drct);

})(window.angular, window.LYTIC);
