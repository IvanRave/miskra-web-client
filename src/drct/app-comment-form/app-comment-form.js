(function(angular){
  'use strict';

  var drct = function(lgr, hprFactory){
	// lazy loading: only once: singleton
	var idPre = 'commentform';

	if (window.VK && window.VK.Observer){
	  // https://vk.com/dev/widget_comments
	  var cbkNewComment = function(num, last_comment, date){
        lgr.warn('newComment', 'from a comment form', {
          num: num,
          last_comment: last_comment,
          date: date
        });
	  };
	  
	  // only once per all widgets
	  window.VK.Observer.subscribe("widgets.comments.new_comment",
								   cbkNewComment);
	}

	// https://vk.com/dev/widget_comments
	var buildWidget = function(parentBlock, pageId, pageUrl){

	  if (!pageId || !pageUrl){
		throw new Error("commentForm: required pageId and pageUrl");
	  }

	  lgr.info('pageUrl', decodeURI(pageUrl));
	  lgr.info('pageId', pageId);
	  
	  if (!window.VK || !window.VK.Widgets || !window.VK.Widgets.Comments){
		lgr.info('noVK', window.VK);
		return;
	  }

	  // tablets can use comments: it is possible for IPads, Galaxy, etc
	  //if (hprFactory.isMobileDevice()){
	  //   lgr.info('noVKCommentsOnMobile', 'bad auth');
	  //   return;
	  // }
	  
	  // Идентификатор страницы на Вашем сайте. Произвольное число. Используется в том случае, если у одной и той же статьи может быть несколько адресов, а также на динамических сайтах, у которых меняется только хеш.
	  
	  var block = document.createElement('div');
	  
	  // unique between pages
	  // and between modules on the same page, like Like and Share
	  block.id = idPre + pageId;

	  parentBlock.appendChild(block);

	  window.VK.Widgets.Comments(block.id, {
		// px only
		// auto - shrink
		// width: 'auto',
		// unlimited
		height: 0,
		// show 10 comments maximum
		limit: 10,
		attach: false,
		autoPublish: 1,
		mini: 0,
		// disable realtime refresh
		norealtime: 1,
        // TODO: doesnt work for vk app
        // but works for a web browser
        // https://miskra.runull
		pageUrl: pageUrl
	  }, pageId);
	};

	return {
	  restrict: 'A', // only attribute
	  link: function(scope, elems, attrs){
		// executed for each widget
		if (!attrs.subjectId){
		  throw new Error('required subjectId');
		}

		// convert unique string to unique id
		var pageId = hprFactory.toHashCode(attrs.subjectId);
		
		buildWidget(elems[0], pageId, attrs.subjectUrl);
	  }
	};
  };

  // contains a form with comments: from VK, FB, or other
  // depends of type of application: site, social app, mobile
  angular.module('myApp.appCommentForm', [
	'myApp.hprFactory'
  ])

	.directive('appCommentForm', [
      'lgr',
	  'hprFactory',
	  drct
	]);

})(window.angular);
