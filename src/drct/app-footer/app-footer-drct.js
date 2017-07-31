(function(angular, APPCONF){
  'use strict';

  var Xpo = function($scope){
    // console.log('appconf', APPCONF);
    // OAUTH only for web apps
    $scope.is_web = !!APPCONF.OAUTH_VKN_ID;
  };
  
  var drct = function(){
    return {
      restrict: 'A',
      templateUrl: 'drct/app-footer/app-footer.tpl.html',
      controller: ['$scope', Xpo]
    };
  };
  
  angular.module('myApp.appFooter', [
    'myApp.appInformer'
  ])
    .directive('appFooter', [
      drct
    ]);
  
})(window.angular, window.APPCONF);
