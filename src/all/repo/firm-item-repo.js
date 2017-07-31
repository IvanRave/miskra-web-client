// Retrieves a firm and convert to our format
(function(angular){
  'use strict';
  
  var xpo = function($q, firmItemFactory){
    return {
      retrieveData: function(id, hash){
		return firmItemFactory.loadFirm(id, hash);
      }
    };
  };

  angular.module('myApp.firmItemRepo', [
    'myApp.firmItemFactory'
  ])
    .factory('firmItemRepo', [
	  '$q',
      'firmItemFactory',
      xpo]);
  
})(window.angular);
