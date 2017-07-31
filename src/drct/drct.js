(function(angular){
  'use strict';

  angular.module('myApp.drct', [])

    .directive('onFinishRender', [
      '$timeout',
      function ($timeout) {
		return {
		  restrict: 'A',
		  link: function (scope, element, attr) {
			if (scope.$last === true) {
			  //console.log('onFinishRender:last', scope.$index);
			  $timeout(function () {
				scope.$emit(attr["onFinishRender"]);
			  });
			}
		  }
		};
      }]);

})(window.angular);
