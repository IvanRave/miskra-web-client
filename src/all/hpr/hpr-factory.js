(function(angular) {
  'use strict';

  var xpo = function() {
    function randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Whether the all elements of a 1-st array exist in a second array
     * Array of strings or numbers
     * [5,7] in [2,7,3,8,5] = true
     * ['a', 'e'] in ['w', 'b'] = false
     * [] in [2,6,7] = true
     * [4,7] in [] = false
     * Works only with sorted arrays
     */
    var isArrInArr = function(a1, a2) {
      if (a1.length === 0) {
        return true;
      }
      if (a2.length === 0) {
        return false;
      }

      a1.sort();
      a2.sort();

      // [5,7] in [2,4,5,7,8]
      // _5_7_ in _2_4_5_7_8_ (or | as a separator: most not used)
      return ('|' + a2.join('|') + '|').indexOf('|' + a1.join('|') + '|') >= 0;
    };

    /**
     * Find an element of an array by value of some property
     */
    var findElemByProp = function(arr, propName, propVal) {
	  
	  // propVal maybe a string or integer or any other type
	  // match with registry ignorance
	  // if (typeof propVal === 'string'){
	  // 	propVal = propVal.toLowerCase();
	  // }
	  
      var elementPos = arr.map(function(x) {
		var elemVal = x[propName];
		
		// if (typeof elemVal === 'string'){
		//   elemVal = elemVal.toLowerCase();
		// }
		
        return elemVal;
      }).indexOf(propVal);

	  //console.log('febp', propName, propVal, elementPos);
	  // arr[-1]  undefined;
	  if (elementPos === -1){
		return null;
	  }
	  
      return arr[elementPos];
    };

	var isElemInViewport = function (el, phase) {
	  phase = phase || 0;
	  var rect = el.getBoundingClientRect();

	  return (
		rect.top >= (0 - phase) &&
		  rect.left >= 0 &&
		  rect.bottom <= ((window.innerHeight || document.documentElement.clientHeight) + phase) && /*or $(window).height() */
		  rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
	  );
	};

    /**
     * WKT POINT(123123.12 442353.3463) 
     *   to {longitude:123, latitude: 442}
     */
    var coordsFromWktPoint = function(wktPoint){
      wktPoint = wktPoint.substr(6, wktPoint.length - 7);
      var tmpArr = wktPoint.split(' ');
      //console.log(tmpArr);
      return {
        lng: parseFloat(tmpArr[0]),
		lat: parseFloat(tmpArr[1])
      };
    };

	var shuffle = function(array) {
	  var counter = array.length, temp, index;
	  // While there are elements in the array
	  while (counter > 0) {
		// Pick a random index
		index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	  }

	  return array;
	};

	var toHashCode = function(str) {
	  str = str + '';
	  var hash = 0, i, chr, len;
	  if (str.length === 0) {
		return hash;
	  }
	  for (i = 0, len = str.length; i < len; i++) {
		chr   = str.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	  }
	  return hash;
	};

    /** Browser info */
    var browserInfo = function(){
      //var nVer = navigator.appVersion;
      var nAgt = navigator.userAgent;
      var browserName  = navigator.appName;
      var fullVersion  = ''+parseFloat(navigator.appVersion);
      var majorVersion = parseInt(navigator.appVersion,10);
      var nameOffset,verOffset,ix;

      // In Opera, the true version is after "Opera" or after "Version"
      if ((verOffset=nAgt.indexOf("Opera")) !== -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset+6);
        if ((verOffset=nAgt.indexOf("Version")) !== -1) {
          fullVersion = nAgt.substring(verOffset+8);
        }
      }
      // In MSIE, the true version is after "MSIE" in userAgent
      else if ((verOffset=nAgt.indexOf("MSIE")) !== -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset+5);
      }
      // In Chrome, the true version is after "Chrome"
      else if ((verOffset=nAgt.indexOf("Chrome")) !== -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset+7);
      }
      // In Safari, the true version is after "Safari" or after "Version"
      else if ((verOffset=nAgt.indexOf("Safari")) !== -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset+7);
        if ((verOffset=nAgt.indexOf("Version")) !== -1){
          fullVersion = nAgt.substring(verOffset+8);
        }
      }
      // In Firefox, the true version is after "Firefox"
      else if ((verOffset=nAgt.indexOf("Firefox")) !== -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset+8);
      }
      // In most other browsers, "name/version" is at the end of userAgent
      else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
                (verOffset=nAgt.lastIndexOf('/')) )
      {
        browserName = nAgt.substring(nameOffset,verOffset);
        fullVersion = nAgt.substring(verOffset+1);
        if (browserName.toLowerCase() === browserName.toUpperCase()) {
          browserName = navigator.appName;
        }
      }
      // trim the fullVersion string at semicolon/space if present
      if ((ix=fullVersion.indexOf(";")) !== -1) {
        fullVersion=fullVersion.substring(0,ix);
      }
      
      if ((ix=fullVersion.indexOf(" ")) !== -1) {
        fullVersion=fullVersion.substring(0,ix);
      }

      majorVersion = parseInt(''+fullVersion,10);
      if (isNaN(majorVersion)) {
        fullVersion  = ''+parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion,10);
      }

      return {
        browserName,
        fullVersion,
        majorVersion,
        appName: navigator.appName,
        userAgent: navigator.userAgent
      };
    };
	
	/**
	 * Whether the device is mobile (not a tablet)
	 * http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
	 */
	var isMobileDevice = function(){
	  var agn = navigator.userAgent||navigator.vendor||window.opera;
	  //console.log('agent', agn);
	  var check = false;

	  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(agn)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agn.substr(0,4))){
		check = true;
	  }
	  
	  return check;
	};

	var cyr = /[а-яё]/ig;

	// pth = /some-url/cyrillic/asdf?name=supernameencoded
	var encodePath = function(pth){
	  var arr = pth.split('/');
	  arr = arr.map(function(item){
		if (cyr.test(item)){
		  item = encodeURIComponent(item);
		}

		return item;
	  });
	  return arr.join('/');
	};
	
    return {
      findElemByProp: findElemByProp,
      isArrInArr: isArrInArr,
      randomIntFromInterval: randomIntFromInterval,
      coordsFromWktPoint: coordsFromWktPoint,
	  isElemInViewport: isElemInViewport,
	  shuffle: shuffle,
	  toHashCode: toHashCode,
	  isMobileDevice: isMobileDevice,
	  encodePath: encodePath,
      browserInfo: browserInfo
    };
  };

  angular.module('myApp.hprFactory', [])

	.factory('hprFactory', [xpo]);

}(window.angular));
