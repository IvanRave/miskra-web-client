(function(angular){
  'use strict';

  // var xpo = function($scope, $location){
  // 	$scope.saveHash = function(hashString){
  // 	  if (hashString){
  // 		$location.hash(hashString);
  // 	  }
  // 	};	
  // };
  
  var drct = function($state, apimas){

	var linkFunc = function(scope, elems){

	  var prv = document.createElement('img');

	  // prv.onload = function(){
	  // 	console.log('images loaded', scope.item.id);
	  // };

	  prv.onerror = function(err){
		prv.onerror = null;
		prv.src = 'data:image/jpeg;base64,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WX73f3qr3oAcylGwRyKmtQcse3ShGWYBJPvdj61YVQoAAwKAGyNsjJ79qo1NcSbm2joKjVSzADqaALNsuEJ9ampFAVQB0FLQAHoaKD0NFABRRRQAVDPHuXcOo/lU1FAGfVmCXcNjde3vUc8W07h909vSoqANCioIp93yvwfX1qegAooooAKKKKACiiigAqCaHd8yj5vT1qeigDO/nU/2hvL2/wAXrST7N3y/e74qKgBKtW0eBvPU9Kihi8w5P3R+tXKACiiigAPQ0UHoaKACiiigAooooACMgg9KqSwFPmXlf5VbooAz6kjnZBg8rUsluG5Xg+lV2VkOGBFAFxZUfoefQ0+s408SOvRjQBeoqoLlx6H8KX7S390UAWqKqG5c9ABTGldurGgC28qJ1P4VXknZuF4H61D9acqsxwoyaAG1LFCZOTwv86kjtwOX5PpVigBAAowBgCloooAKKKKAA9DRQehooAKKKKACiiigAooooAKQgEYIyKWigCFrZD93K1EbZx0wat0UAUTE46qabtPTBrQooAoiNyeFNPFs564H41booAhW2UdSTUoAUYAwKWigAooooAKKKKACiiigAPQ0UHoaKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAD0NFFFAH//Z';
		
		apimas.sendReportNoImage({
		  id: scope.item.id
		});

		// there doesn't seem to be a way to get the response code, so you're limited to knowing only whether the image loaded or not.
		// http://stackoverflow.com/questions/14226644/check-image-http-status-codes-using-jquery-js
		console.log('image error', scope.item.id, err);
	  };
	  
	  prv.className = 'ximg__img'; 

	  var lnk = document.createElement('a');
	  lnk.href = $state.href('byt.mediaItem', {
	  	media_id: scope.item.id
	  });

	  var hsh = scope.wrapElemId;
	  if (hsh){
		lnk.onclick = function(){
		  //console.log('clicked', hsh);
		  window.location.hash = hsh;
		  // continue run link
		  return true;
		  // $location.hash(hsh);
		  // scope.$apply();
		  // return true;
		};
	  }
	  
	  var block = document.createElement('div');
	  block.className = 'ximg';

	  lnk.appendChild(prv);
	  block.appendChild(lnk);

	  // add to the main elem of directive
	  elems[0].appendChild(block);

	  scope.$watch('isShowImage', function(nval){
		if (nval){
		  prv.src = scope.item.preview_img;
		}
	  });
	  
	  // raw.append
	  // 	  <div class="ximg">
	  //   <a ui-sref="byt.mediaItem({media_id: item.id})"
	  // 	 ng-click="saveHash(wrapElemId)">
	  // 	<img ng-src="{{item.preview_img}}"
	  // 		 ng-if="isShowImage"
	  // 		 class="ximg__img"/>
	  //   </a>
	  // </div>
	};
	
	return {
	  restrict: 'A', // only attribute
	  //templateUrl: 'drct/gallery-item/gallery-item.tpl.html',
	  scope: {
		item: '=appItem',
		isShowImage: '=appIsShowImage',
		wrapElemId: '=appWrapElemId'
		//stateShow.val || $first
	  },
	  link: linkFunc
	};
  };
  
  angular.module('myApp.appGalleryItem', [
	'myApp.apimas'
  ])

	.directive('appGalleryItem', [
	  '$state',
	  'apimas',
	  drct
	]);

})(window.angular);
