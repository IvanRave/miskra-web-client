// https://vk.com/dev/widget_like

(function(angular){
  'use strict';

  var drct = function(apimas, hprFactory){
	var preId = "vklike";

	if (window.VK && window.VK.Observer){
	  // https://vk.com/dev/widget_like
	  var cbkNewLike = function(likeCount){
		console.log('new like', likeCount);
		
		apimas.sendRegFree({
		  link: 'New like: ' + new Date().toString() + ': ' + likeCount
		})
		  .then(function(){
			console.log('like reg-free success');
		  })
		  .catch(function(e){
			console.log('like reg-free error');
			console.log(e);
		  });
	  };
	  
	  // only once per all widgets
	  // no variants to send pageId
	  // maybe just using unsubscribe first (all previous)
	  window.VK.Observer.subscribe("widgets.like.liked",
								   cbkNewLike);
	}
	
	var buildWidget = function(parentBlock, pageId, pageUrl,
							   pageImage, pageTitle, pageDescription){
	  
	  if (!pageId || !pageUrl){
		throw new Error("required pageId and pageUrl");
	  }

	  console.log('pageUrl', decodeURI(pageUrl));
	  console.log('pageId', pageId);

	  console.log('pageImage', pageImage);

	  //elems[0].innerHTML = 'super';	 
	  
	  if (!window.VK || !window.VK.Widgets || !window.VK.Widgets.Like) {
		console.log('no vklib like', window.VK);
		return;
	  }

	  if (hprFactory.isMobileDevice()){
		console.log('no VK likes for mobile devices: bad auth');
		return;
	  }

	  var opts = {
		type: "button",
		// max height
		height: 24,
		url: pageUrl,
		pageUrl: pageUrl,
		title: pageTitle,
		pageTitle: pageTitle,
		description: pageDescription,
		pageDescription: pageDescription
	  };

	  if (pageImage){
		opts.image = pageImage;
		opts.pageImage = pageImage;
	  }

	  //console.log('opts', opts);
	  var block = document.createElement('div');
	  block.id = preId + pageId;

	  parentBlock.appendChild(block);
	  
	  // draw a button
	  // todo: add an event to track this event
	  window.VK.Widgets.Like(block.id,
							 opts,
							 pageId);
	};

	
	var linkFunc = function(scope, elems, attrs) {
	  
	  console.log('appVkLike', elems[0]);

	  if (!attrs.subjectId){
		throw new Error('required subjectId');
	  }

	  // convert unique string to unique id
	  // subjectId depends of type and id of subject
	  // - supplier123456
	  // - media432423
	  var pageId = hprFactory.toHashCode(attrs.subjectId);

	  buildWidget(elems[0], pageId, attrs.subjectUrl,
				  attrs.pageImage, attrs.pageTitle,
				  attrs.pageDescription);
	};


	// calculate id from master_profile_id, but
	// without name prop (name can be changed)
	// without site link (site host can be changed)
	// the same for works and servs
	return {
	  restrict: 'A', // only attribute
	  link: linkFunc
	};
  };

  angular.module('myApp.appVkLike', [
	'myApp.apimas',
	'myApp.hprFactory'
  ])

	.directive('appVkLike', [
	  'apimas',
	  'hprFactory',
	  drct
	]);
})(window.angular);
