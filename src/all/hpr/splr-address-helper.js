(function(angular){
  'use strict';


  var xpo = function(){
	/**
	 * Calculate address 
	 * @returns {String}
	 */
	var calcAddrFromDescription = function(dscr){
	  var addrObj;
	  
	  try {
		addrObj = JSON.parse(dscr);
	  }
	  catch(exc){
		console.log('tbl parse address', exc);
		console.log('dscr', dscr);
		return '';
	  }
	  
	  var tmpAddrArr = [addrObj.supRegion,
						addrObj.supStreet];
	  
	  tmpAddrArr = tmpAddrArr.filter(function(tmpStr){
		return !!tmpStr;
	  });
	  
	  return tmpAddrArr.join(', ');
	};

    /**
     * Comment: 
     * - how to find
     * - floor
     * - etc.
     */
    var calcCommentFromDescription = function(dscr){
	  var addrObj;
	  
	  try {
		addrObj = JSON.parse(dscr);
	  }
	  catch(exc){
		console.log('tbl parse address', exc);
		console.log('dscr', dscr);
		return '';
	  }

      return addrObj.supComment;
	};

	/**
	 * Calculate address for out works
	 * @returns {String}
	 */
	var calcOutGeoFromDescription = function(dscr){
	  var addrObj;
	  
	  try {
		addrObj = JSON.parse(dscr);
	  }
	  catch(exc){
		console.log('tbl parse address', exc);
		return '';
	  }

	  if (!addrObj.cusRegions){
		return '';
	  }
	  
	  var result = addrObj.cusRegions.join(', ');
	  if (addrObj.cusConds) {
		result += ' (' + addrObj.cusConds + ')';
	  }
	  
	  return result;
	};

	return {
	  calcAddrFromDescription: calcAddrFromDescription,
      calcCommentFromDescription: calcCommentFromDescription,
	  calcOutGeoFromDescription: calcOutGeoFromDescription
	};

  };

  angular.module('myApp.splrAddressHelper', [])
	.factory('splrAddressHelper', [xpo]);
  
})(window.angular);
