(function(angular) {
  'use strict';

  var repo = {
	articles: [{
	  ttl: 'Укрепление ресниц: 7 простых шагов',
	  lnk: 'http://blog.miskra.ru/post/%D1%83%D0%BA%D1%80%D0%B5%D0%BF%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D1%80%D0%B5%D1%81%D0%BD%D0%B8%D1%86/',
	  rubrics: [
		'lashesStrong',
		'extEyelashes',
		'lashesAll',
		'lashesExtClassic',
		'lashesCorrection',
		'lashesModel'
	  ]
	}, {
	  ttl: '10 этапов домашнего ламинирования волос',
	  lnk: 'http://blog.miskra.ru/post/%D0%B4%D0%BE%D0%BC%D0%B0%D1%88%D0%BD%D0%B5%D0%B5-%D0%BB%D0%B0%D0%BD%D0%BC%D0%B8%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%B2%D0%BE%D0%BB%D0%BE%D1%81/',
	  rubrics: [
		'laminationHair',
		'highlightHair',
		'toningHair',
		'colorationHair',
		'settingHair'
	  ]
	},{
	  ttl: 'Модные стрижки 2016',
	  lnk: 'http://blog.miskra.ru/post/%D0%BC%D0%BE%D0%B4%D0%BD%D1%8B%D0%B5-%D1%81%D1%82%D1%80%D0%B8%D0%B6%D0%BA%D0%B8-2016/',
	  rubrics: [
		'careHairCut',
		'ladderHairCut',
		'poluboksHairCut',
		'womanHairCut',
		'shortHairCut',
		'modelHairCut',
		'bobHairCut',
		'cutHair',
		'pixieHairCut',
		'cascadeHairCut',
		'middleHairCut'
	  ]
	},{
	  ttl: 'Профессиональный макияж для всех',
	  lnk: 'http://blog.miskra.ru/post/%D0%BF%D1%80%D0%BE%D1%84%D0%B5%D1%81%D1%81%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9-%D0%BC%D0%B0%D0%BA%D0%B8%D1%8F%D0%B6-%D0%B4%D0%BB%D1%8F-%D0%B2%D1%81%D0%B5%D1%85/',
	  rubrics: [
		'makeupProfi',
		'makeup3d',
		'makeupEye',
		'makeupEyelid',
		'makeupProm',
		'makeupHoliday',
		'makeupHollywood',
		'makeupBusiness',
		'makeupEvening',
		'makeupDaytime',
		'makeupWedding',
		'makeupUsual'
	  ]
	}, {
	  ttl: 'Секреты возрастного макияжа для мудрых женщин',
	  lnk: 'http://blog.miskra.ru/post/%D1%81%D0%B5%D0%BA%D1%80%D0%B5%D1%82%D1%8B-%D0%B2%D0%BE%D0%B7%D1%80%D0%B0%D1%81%D1%82%D0%BD%D0%BE%D0%B3%D0%BE-%D0%BC%D0%B0%D0%BA%D0%B8%D1%8F%D0%B6%D0%B0-%D0%B4%D0%BB%D1%8F-%D0%BC%D1%83%D0%B4%D1%80%D1%8B%D1%85-%D0%B6%D0%B5%D0%BD%D1%89%D0%B8%D0%BD/',
	  rubrics: [
		'makeupAge',
		'makeupEast',
		'makeupEye',
		'makeupEyelid',
		'makeupHoliday',
		'makeupBusiness',
		'makeupEvening',
		'makeupDaytime',
		'makeupUsual'
	  ]
	}]
  };

  var xpo = function(){

	
	return {
	  calcByRubricId: function(rubricId){		
		return repo.articles.filter((article) => {
		  return article.rubrics.indexOf(rubricId) >= 0;
		});	
	  }
	};
  };
  
  angular.module('myApp.blogRepo', [])

    .factory('blogRepo', [
      xpo
    ]);

}(window.angular));
