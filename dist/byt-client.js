'use strict';

(function (angular) {
  'use strict';

  var xpo = function xpo($anchorScrollProvider, $sceProvider, $compileProvider, localStorageServiceProvider) {

    $sceProvider.enabled(true);

    // $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|skype):/);

    //	$compileProvider.aHrefSanitizationWhitelist(/^\s*(app|skype):/);

    // https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(true);

    $anchorScrollProvider.disableAutoScrolling();

    // all values in storage will be ppa.somevalue
    // https://github.com/grevory/angular-local-storage
    localStorageServiceProvider.setPrefix('ppa').setStorageType('localStorage');

    // Disable: put session id to requests in API helper
    //          only for API requests (not for others, such CSS, JS files)
    // jwtInterceptorProvider.tokenGetter = [
    //   function() {
    //     return sid;
    //   }
    // ];

    // $httpProvider.interceptors.push('jwtInterceptor');
  };

  angular.module('myApp.appConfig', ['LocalStorageModule', // bower angular-local-storage
  'myApp.templateFactory', // auto-generated to template-cache using tcache task in gulp
  //'angular-jwt',
  // implemented in index.html as main controller of the app
  'myApp.readiness', 'myApp.lgr', 'ngSanitize']).config(['$anchorScrollProvider', '$sceProvider', '$compileProvider', 'localStorageServiceProvider',
  //'jwtInterceptorProvider',	  
  xpo]);

  //	.value('$anchorScroll', angular.noop);
})(window.angular);
'use strict';

(function (angular) {
  'use strict';

  var xpo = function xpo() {};

  angular.module('myApp.AppController', ['myApp.appFilters']).controller('AppController', [xpo]);
})(window.angular);
'use strict';

(function (angular, SNNS, lytic) {
	'use strict';

	function getUrlParts(url) {
		var a = document.createElement('a');
		a.href = url;

		return {
			href: a.href,
			host: a.host,
			hostname: a.hostname,
			port: a.port,
			pathname: a.pathname,
			protocol: a.protocol,
			hash: a.hash,
			search: a.search
		};
	}

	function getRelativeUrl(absUrl) {
		var parts = getUrlParts(absUrl);

		return parts.pathname + (parts.search || '') + (parts.hash || '');
	}

	var runXpo = function runXpo($rootScope, statePrev) {

		var cbkChangeSuccess = function cbkChangeSuccess(evt, absNewUrl, absOldUrl) {
			//	 newState, oldState
			//console.log('success', evt, absNewUrl, absOldUrl);
			// equals for first enter
			if (absOldUrl === absNewUrl) {
				statePrev.url = null;
			} else {
				statePrev.url = absOldUrl;
				//console.log(absOldUrl, absNewUrl);
			}

			// console.log('toState', getRelativeUrl(absNewUrl));
			// new path as an argument
			lytic.trackPage(getRelativeUrl(absNewUrl));
			//$state.href(fromState.name, fromParams);
		};

		// stateChange events doesnt works with hashes
		// New history state object
		$rootScope.$on('$locationChangeSuccess', cbkChangeSuccess);

		// Define window.title on a page level dinamically, like
		//   name of a master or a city or rubric name
	};

	/**
  * @ngdoc module
  * @name myApp
  * @description
  *
  * Declare app level module which depends on views
  *
  * #Usage
  *
  * To see some sees
  */
	angular.module('myApp', ['ngAria',
	// todo: re-back after phantom bag
	'ngSanitize', 'myApp.appConfig', 'myApp.routeConfig',
	// register all events
	'myApp.analyticsOn', 'myApp.statePrev']).run(['$rootScope', 'statePrev',
	// '$window',	 
	// '$location',
	// '$state',
	runXpo]);

	// http://stackoverflow.com/questions/20692203/cordova-deviceready-event-not-firing-from-within-angular-run-block
	var loadTheApp = function loadTheApp() {
		console.log('waitWhileInit...');
		// window.setTimeout(function(){
		SNNS.waitWhileInit(function (err) {
			if (err) {
				alert(err.message);
				return;
			}

			if (!window.APPCONF.XUID) {
				console.warn('XUID');
			}

			if (!window.APPCONF.XSID) {
				console.warn('XSID');
			}

			var els = document.getElementsByClassName("start-loader");

			if (els[0]) {
				els[0].style.display = 'none';
			}

			//console.log('bootstraped');

			angular.bootstrap(document, ['myApp'], {
				// https://docs.angularjs.org/guide/production
				strictDi: true
			});
			// var appwrap = document.getElementById('appwrap');
			// appwrap instead document
		});
		// }, 60000);
	};

	console.log('starting...');

	angular.element(document).ready(function () {
		if (window.cordova) {
			console.log('cordova initialized');
			document.addEventListener('deviceready', loadTheApp, false);
		} else {
			loadTheApp();
		}
	});

	// var Mytag = document.registerElement('my-tag');
	// document.body.appendChild(new Mytag());

	// var mytag = document.getElementsByTagName("my-tag")[0];
	// mytag.textContent = "I am a my-tag element.";

	// var tmpl = document.querySelector('template'); //Step 1
})(window.angular, window.snns, window.LYTIC);
'use strict';

// All route params injected only here
// except splr-manager-router
// Do not send StateParams or RouteParams objects to controllers
(function (angular) {
  'use strict';
  /* eslint quotes: 0 */

  var deps = ['ui.router',

  // child routers
  'myApp.mngrRouter', 'myApp.WlcController', 'myApp.AggloItemController', 'myApp.AggloListController',
  //'myApp.SpecListController',
  'myApp.specListDrct', 'myApp.rubricListDrct', 'myApp.aggloListDrct', 'myApp.mediaItemDrct', 'myApp.breadcrumbDrct', 'myApp.appFooter', 'myApp.appToolbar', 'myApp.AppMapController', 'myApp.SpecItemController',
  // ideally: this controllers and states need to move
  //          to child folders
  'myApp.RubricItemController', 'myApp.TblViewController', 'myApp.PrtfViewController', 'myApp.OfferListController', 'myApp.SplrLoginController', 'myApp.SplrItemController', 'myApp.SplrMainController',
  // 'myApp.ServItemController',
  // 'myApp.WorkItemController',

  'myApp.SplrManagerController', 'myApp.userStatusDrct', 'myApp.AppController',

  //    'myApp.AggloTblViewController',

  'myApp.OauthLoginController',

  // quiz
  'myApp.QuizItemController', 'myApp.qstnListDrct', 'myApp.lgr'
  // 'myApp.qresItemDrct'
  ];

  // var mediaController = function(scp, media_id){
  //     scp.media_id = media_id;   
  // };

  // mediaController.$inject = ['$scope', 'media_id'];

  var xpo = function xpo($urlRouterProvider, $stateProvider, $locationProvider, mngrRouterProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');
    // ! для совместимости с браузерами,
    //   не поддерживающими javascript

    var baseRoute = ''; //'/www-dev',
    var basePath = '/'; // was '/welcome'

    // executed after all child router's config executed
    //console.log('baseRouter');

    // setup an abstract state for the tabs directive
    // http://angular-ui.github.io/ui-router/site/
    $stateProvider.state('byt', {
      url: baseRoute,
      'abstract': true,
      views: {
        'mainContent': {
          templateUrl: 'app.tpl.html',
          controller: 'AppController',
          controllerAs: 'crApp'
        }
      }
    })

    // includes city selector and other welcome features
    .state('byt.welcome', {
      url: basePath,
      views: {
        'appContent': {
          templateUrl: 'welcome/wlc.tpl.html',
          controller: 'WlcController'
        }
      }
    })

    // disallowed
    .state('byt.map', {
      url: '/map?{ll:string}&{z:int}&{g:string}&{spec:string}',
      views: {
        'appContent': {
          templateUrl: 'app-map/app-map.tpl.html',
          controller: 'AppMapController'
        }
      },
      // do no reload if query params has changes
      // like: $location.search
      // reloadOnSearch: false,
      resolve: {
        q_ll: ['$stateParams', function ($stateParams) {
          return $stateParams.ll;
        }],
        q_z: ['$stateParams', function ($stateParams) {
          return $stateParams.z;
        }],
        q_g: ['$stateParams', function ($stateParams) {
          return $stateParams.g;
        }],
        q_spec: ['$stateParams', function ($stateParams) {
          return $stateParams.spec;
        }]
      }
    }).state('byt.mediaItem', {
      // it may be media: photo, video, etc.
      // a work can contain few photos and videos
      // at this moment: main photo of a work
      // media_id = work_id
      // media123 - is not supported, because
      //  it may be corrupted by /otherpathatthislevel values
      // m - may be 'mobile'
      // p - russian symbol
      // media/123 - sounds better
      url: '/media/{media_id:int}',
      views: {
        // 'appContent': {
        //   templateUrl: 'quiz-item/quiz-item.tpl.html',
        //   controller: 'QuizItemController'
        // }
        'appContent': {
          template: '<div class="full-height" ng-if="media_id">\n<div class="full-height" data-media-item-drct data-media-id="{{media_id}}">\n</div>\n</div>',
          controller: ['$scope', 'lgr', 'media_id', function ($scope, lgr, media_id) {
            if (!media_id) {
              lgr.crit('errMediaItem', 'no media id');
            } else {
              $scope.media_id = media_id;
            }
          }]
        }
      },
      resolve: {
        media_id: ['$stateParams', function ($stateParams) {
          // this resolve executes before parent controllers
          return $stateParams.media_id;
        }]
      }
    }).state('byt.quizItem', {
      url: '/q/{quiz_ttl:string}',
      'abstract': true,
      views: {
        'appContent': {
          templateUrl: 'quiz-item/quiz-item.tpl.html',
          controller: 'QuizItemController'
        }
      },
      resolve: {
        quiz_ttl: ['$stateParams', function ($stateParams) {
          return $stateParams.quiz_ttl;
        }]
      }
    }).state('byt.quizItem.qstnList', {
      url: '/',
      views: {
        'quizContent': {
          template: '<div qstn-list-drct data-quiz-item="quizItem"></div>'
        }
      }
    })

    // to insert a new supplier
    // /suppliers/?mode=INSERT

    .state('byt.aggloList', {
      // города
      //url:'/%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0',
      url: '/города',
      views: {
        'appContent': {
          templateUrl: 'agglo-list/agglo-list.tpl.html',
          controller: 'AggloListController'
        }
      }
    })

    // agglo + link to specs
    .state("byt.aggloItem", {

      // order1234 the same as cityNewYork - it is not good practic - need to divide words (and numbers). One exception - for id1234, because id - is a property, and used in social networks
      // города
      url: "/города/:agglo_local_name",
      //url: "/%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0/:agglo_local_name",
      // this view - is a template for child views
      'abstract': true,
      views: {
        'appContent': {
          templateUrl: 'agglo-item/agglo-item.tpl.html',
          controller: 'AggloItemController'
        }
      },
      resolve: {
        q_agglo_local_name: ['$stateParams', function ($stateParams) {
          // this resolve executes before parent controllers
          return $stateParams.agglo_local_name;
        }]
      }
    })

    // .state("byt.aggloItem.aggloTblView", {
    //     url: "/каталог",
    //     views: {
    //       // aggloItem.xxx -> aggloItemContent
    //       'aggloItemContent': {
    //         templateUrl: 'agglo-item/agglo-tbl-view/agglo-tbl-view.tpl.html',
    //         controller: 'AggloTblViewController'
    //       }
    //     },
    //     data: {
    //       ttl: 'мастера и салоны красоты - каталог - {agglo_local_name}'
    //     }
    // })

    // after agglo selection: info agglo + specs
    .state("byt.aggloItem.specList", {
      url: "/услуги",
      views: {
        // aggloItem.xxx -> aggloItemContent
        'aggloItemContent': {
          template: '<div class="full-height" data-spec-list-drct data-agglo="cur_agglo"></div>'
          //            templateUrl: 'agglo-item/spec-list/spec-list.tpl.html',
          //        controller: 'SpecListController'
        }
      }
    }).state("byt.aggloItem.specItem", {
      url: "/услуги/:spec_name",
      'abstract': true,
      views: {
        'aggloItemContent': {
          templateUrl: 'agglo-item/spec-item/spec-item.tpl.html',
          controller: 'SpecItemController'
        }
      },
      resolve: {
        // this resolve executes before parent controllers
        q_spec_name: ['$stateParams', function ($stateParams) {
          return $stateParams.spec_name;

          // do not check it: it is not necessary to load
          //   this spec before using.
          //   Load it after resolving: in controller body
        }]
      }
    }).state("byt.aggloItem.specItem.rubricList", {
      url: "/рубрики", // /services
      views: {
        'specItemContent': {
          template: '<div class="full-height" data-rubric-list-drct data-agglo="cur_agglo" data-spec="cur_spec"></div>'
        }
      }
    })

    // skipped in sitemap generator: see README in stm
    // rubricItemServices: contains links to other rubricItems
    .state("byt.aggloItem.specItem.rubricItem", {
      url: "/рубрики/:rubric_name", // /services
      "abstract": true,
      views: {
        // abstract view: contains links to types of a view
        'specItemContent': {
          templateUrl: 'agglo-item/spec-item/rubric-item/rubric-item.tpl.html',
          controller: 'RubricItemController'
        }
      },
      resolve: {
        q_rubric_name: ['$stateParams', function ($stateParams) {
          // all - to show all rubrics
          return $stateParams.rubric_name;
        }]
      }
    })

    // first - used 301 redirect on server side
    .state("byt.aggloItem.specItem.rubricItem.prtfPrev", {
      url: "/портфолио",
      resolve: {
        rdr: ['$location', '$state', '$stateParams', function ($location, $state, $stateParams) {
          $location.url($state.href("byt.aggloItem.specItem.rubricItem.tblView", $stateParams));
        }]
      }
    })

    // skipped in sitemap generator: see README in stm
    .state("byt.aggloItem.specItem.rubricItem.prtfView", {
      url: "/фото",
      views: {
        'rubricItemContent': {
          templateUrl: 'agglo-item/spec-item/rubric-item/prtf-view/prtf-view.tpl.html',
          controller: 'PrtfViewController'
        }
      }
    })

    // skipped in sitemap generator: see README in stm
    .state("byt.aggloItem.specItem.rubricItem.tblView", {
      url: "/каталог",
      views: {
        'rubricItemContent': {
          templateUrl: 'agglo-item/spec-item/rubric-item/tbl-view/tbl-view.tpl.html',
          controller: 'TblViewController'
        }
      }
    })

    // disallowed
    .state("byt.splrManager", {
      url: "/manage{supplier_id:[0-9]{6,50}}",
      views: {
        'appContent': {
          templateUrl: "splr-manager/splr-manager.tpl.html",
          controller: "SplrManagerController"
        }
      },
      resolve: {
        q_id: ['$stateParams', function ($stateParams) {
          // this resolve executes before parent controllers
          // console.log('supplier resolve', $stateParams.supplier_id);
          return +$stateParams.supplier_id;
        }]
      }
    })

    // disallowed
    .state("byt.splrLogin", {
      url: "/login-pwd",
      views: {
        'appContent': {
          templateUrl: "splr-login/splr-login.tpl.html",
          controller: 'SplrLoginController'
        }
      }
    })

    // disallowed
    .state("byt.oauthLogin", {
      url: "/login", //?redirect_url
      views: {
        'appContent': {
          templateUrl: "splr-login/oauth-login.tpl.html",
          controller: 'OauthLoginController'
        }
      }
      // resolve: {
      //   q_redirect_url: ['$stateParams', function($stateParams){
      //     return $stateParams.redirect_url;
      //   }]
      // }
    })

    // disallowed
    .state("byt.oauthCallback", {
      // forbidden in robots
      url: "/callback",
      views: {
        'appContent': {
          templateUrl: "splr-login/oauth-callback.tpl.html"
        }
      }
    }).state("byt.splrItem", {
      url: "/id{supplier_id:[0-9]{6,50}}?hash&tpe&name",
      'abstract': true,
      views: {
        'appContent': {
          templateUrl: "splr/splr-item.tpl.html",
          controller: 'SplrItemController'
        }
      },
      resolve: {
        q_name: ['$stateParams', function ($stateParams) {
          return $stateParams.name;
        }],
        q_id: ['$stateParams', function ($stateParams) {
          // this resolve executes before parent controllers
          // console.log('supplier resolve', $stateParams.supplier_id);
          // convert to integer
          return +$stateParams.supplier_id;
        }],
        q_hash: ['$stateParams', function ($stateParams) {
          return $stateParams.hash;
        }],
        q_tpe: ['$stateParams', function ($stateParams) {
          return $stateParams.tpe;
        }]
      }
    }).state("byt.splrItem.main", {
      url: "",
      views: {
        'splrItemContent': {
          templateUrl: "splr/main/splr-main.tpl.html",
          controller: 'SplrMainController'
        }
      }
    }).state("byt.splrItemF", {
      url: "/fid{supplier_id:[0-9]{6,50}}?hash&tpe&name",
      'abstract': true,
      views: {
        'appContent': {
          templateUrl: "splr/splr-item.tpl.html",
          controller: 'SplrItemController'
        }
      },
      resolve: {
        q_name: ['$stateParams', function ($stateParams) {
          return $stateParams.name;
        }],
        q_id: ['$stateParams', function ($stateParams) {
          // this resolve executes before parent controllers
          // console.log('supplier resolve', $stateParams.supplier_id);
          return +$stateParams.supplier_id;
        }],
        q_hash: ['$stateParams', function ($stateParams) {
          return $stateParams.hash;
        }],
        q_tpe: ['$stateParams', function ($stateParams) {
          return $stateParams.tpe;
        }]
      }
    }).state("byt.splrItemF.main", {
      url: "",
      views: {
        'splrItemContent': {
          templateUrl: "splr/main/splr-main.tpl.html",
          controller: 'SplrMainController'
        }
      }
    }).state("byt.index", {
      url: "/index.html",
      resolve: {
        rdr: ['$location', '$state', '$stateParams', function ($location, $state, $stateParams) {
          $location.url($state.href("byt.welcome", $stateParams));
        }]
      }
    }).state("byt.indexvkn", {
      url: "/index-vkn.html",
      resolve: {
        rdr: ['$location', '$state', '$stateParams', function ($location, $state, $stateParams) {
          $location.url($state.href("byt.welcome", $stateParams));
        }]
      }
    }).state("byt.indexfbk", {
      url: "/index-fbk.html",
      resolve: {
        rdr: ['$location', '$state', '$stateParams', function ($location, $state, $stateParams) {
          $location.url($state.href("byt.welcome", $stateParams));
        }]
      }
    });

    // console.log('mngrRouter', mngrRouterProvider.$get());
    // http://stackoverflow.com/questions/17485900/injecting-dependencies-in-config-modules-angularjs
    mngrRouterProvider.$get().initRouter($stateProvider);

    $stateProvider.state("byt.otherwise", {
      // Special syntax for catch all.
      url: "/{path:.*}",
      views: {
        'appContent': {
          template: '<div class="err-msg">Запрашиваемая страница не найдена: {{q_path}}</div><div class="err-alt"><a href="/">Перейти на главную</a></div>',
          controller: ['$scope', 'readiness', 'q_path', function ($scope, readiness, q_path) {
            $scope.q_path = q_path;
            // <meta name="prerender-status-code" content="404">
            readiness.notFound();
          }]
        }
      },
      resolve: {
        q_path: ['$stateParams', function ($stateParams) {
          return $stateParams.path;
        }]
      }
    });

    //console.log('main router');

    //$urlRouterProvider.otherwise("/welcome");
    // $urlRouterProvider
    //   .otherwise(function($injector, $location){

    //   ... some advanced code...
    //      });
    //.otherwise(baseRoute + basePath);
  };

  angular.module('myApp.routeConfig', deps).config(['$urlRouterProvider', '$stateProvider', '$locationProvider', 'mngrRouterProvider', xpo]);
})(window.angular);
'use strict';

// aggloItemRoute loads agglo itself only
//   no array of children, like specList or rubricList

// #!/cities/spb/specs/hair
//   show links to servicesByMaster and servicesBySalon
//   usually this page skipped (select 'hair' + 'by' together)
// #!/cities/spb/specs/hair/services
//    ?by=master&rubrics=hairExt,hairCut
// #!/cities/spb/specs/hair/services
//    ?by=salon
// if (!by) redirect to #!/cities/spb/specs (to select again)
// if (rubrics.length === 0) show nothing
//    usually only one rubric - selected
//    if few rubrics are selected - re-load a state every time
(function (angular) {
	'use strict';

	var xpo = function xpo($scope, $timeout, $state, readiness, aggloItemRepo, q_agglo_local_name) {
		/**
   * Selected agglomeration:
   *   calculated from url state
   *   only works in this view
   *   retrieve agglomerations if not exists (update a page)
   *   or show this view if all agglos are retrieved
   */

		//console.log('loaded agglo item', q_agglo_local_name);

		var handleAgglo = function handleAgglo(tmpAgglo) {

			// Redirect to list: if no such city
			// In a list view: try auto-recognition

			$scope.cur_agglo = tmpAgglo;
			$scope.home_href = $state.href('byt.aggloItem.specList', {
				agglo_local_name: tmpAgglo.local_name
			});

			// readiness -> in nested views
			// redirect to specList: download rubrics
		};

		var handleErr = function handleErr(tmpError) {
			if (tmpError.status === 404) {
				$scope.err_cur_agglo = {
					msg: 'Город ' + q_agglo_local_name + ' не найден'
				};
				// todo: show error message
				readiness.notFound();
				return;
			}

			console.log('aggloRetrieveError');
			console.log(tmpError);
			$scope.err_cur_agglo = {
				msg: 'Технические неполадки: не удалось подключиться к серверу'
			};
			readiness.serverError(tmpError);
		};

		// Load agglos, then load geo location
		// TODO: download only selected city with addt info
		//       using q_agglo_id or q_agglo_local_name
		// console.log('retrieve agglo if not yet loaded');
		// or just inject it to a client
		// aggloItemRepo.retrieveByLocalName(local_name)
		// returns city with details
		aggloItemRepo.retrieveByLocalName(q_agglo_local_name).then(handleAgglo).catch(handleErr);

		// show it with 500ms delay
		$timeout(function () {
			$scope.is_prg = true;
		}, 500);
	};

	angular.module('myApp.AggloItemController', ['myApp.aggloItemRepo', 'myApp.readiness']).controller('AggloItemController', ['$scope', '$timeout', '$state', 'readiness', 'aggloItemRepo', 'q_agglo_local_name', xpo]);
})(window.angular);
'use strict';

(function (angular) {
   'use strict';

   /**
    * A list with cities (manual selection)
    */

   var xpo = function xpo($scope, $state, readiness, geoAggloRepo) {

      var ttl = 'Выбор города';

      $scope.page_ttl = ttl;

      //console.log('agglo list controller');
      // translate agglo_repo to $scope

      var cbkCatch = function cbkCatch(tmpError) {
         $scope.agglo_err = {
            msg: 'Технические неполадки: не удалось подключиться к серверу.'
         };
         // title is not important for crawlers: it is an error
         readiness.serverError(tmpError);
         console.log('aggloRetrieveError', tmpError);
      };

      // Load all cities (if not yet loaded)
      // only next params { local_name, id, center, region - to build a map
      //console.log('retrieve all agglos');
      geoAggloRepo.retrieveData().then(function (arrGeoAgglo) {
         $scope.arr_geo_agglo = arrGeoAgglo;
         // in title or description: list of large cities

         var canonicalPath = $state.href("byt.aggloList");

         readiness.ok(ttl, 'Указание необходимого города из списка: Москва, Санкт-Петербург, Новосибирск, Алматы, Екатеринбург, Нижний Новгород, Казань, Челябинск, Омск, Самара и другие города', canonicalPath);
      }).catch(cbkCatch);
   };

   angular.module('myApp.AggloListController', ['myApp.geoAggloRepo', 'myApp.readiness']).controller('AggloListController', ['$scope', '$state', 'readiness', 'geoAggloRepo', xpo]);
})(window.angular);

/* Alternative: modal
 * Open a modal window with agglo selection
 *   it might be simple list or a map (vNext)
 *   open, even agglos are not loaded yet
 *   will be attached later to opened window
 * Close modal window with agglo selector
 */
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
	'use strict';

	var Xpo = function Xpo($scope, $state) {
		_classCallCheck(this, Xpo);

		$scope.calcAggloHref = function (aggloLocalName) {
			// var myState = $state.get("byt.aggloItem.specList");
			// console.log(myState);

			return $state.href("byt.aggloItem.specList", {
				agglo_local_name: aggloLocalName
			});
			//ui-sref="byt.aggloItem.specList({agglo_local_name:'asdf zxvv'})">
		};
	};

	var drct = function drct() {
		return {
			restrict: 'A',
			scope: {
				arrGeoAgglo: '='
			},
			templateUrl: 'agglo-list/agglo-list-drct.tpl.html',
			controller: ['$scope', '$state', Xpo]
		};
	};

	angular.module('myApp.aggloListDrct', []).directive('aggloListDrct', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	angular.module('myApp.appFilters', []).filter('range', function () {
		return function (input, total) {
			total = parseInt(total, 10);
			for (var i = 0; i < total; i += 1) {
				input.push(i);
			}
			return input;
		};
	}).filter('enclink', function () {
		return window.encodeURIComponent;
	});
})(window.angular);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
	'use strict';

	var fromCoordsToStr = function fromCoordsToStr(tmpLng, tmpLat) {
		return tmpLng.toString(10) + ',' + tmpLat.toString(10);
	};

	// parse it to coords
	// long,lat
	// -39.3245,-43.654234
	var parseLngLat = function parseLngLat(ll) {
		if (!ll) {
			return null;
		}

		var arr = ll.split(',');

		if (!arr[0] || !arr[1]) {
			return null;
		}

		var intLng = parseFloat(arr[0]);
		if (intLng < -180 || intLng > 180) {
			return null;
		}

		var intLat = parseFloat(arr[1]);
		if (intLat < -90 || intLat > 90) {
			return null;
		}

		return {
			lng: intLng,
			lat: intLat
		};
	};

	var parseZoom = function parseZoom(zoomStr) {
		var intZoom = parseInt(zoomStr, 10);

		if (intZoom < 0 || intZoom > 18) {
			return null;
		}

		return intZoom;
	};

	var checkEnough = function checkEnough(prev_center, upd_center) {
		// check params
		prev_center = prev_center || {};
		upd_center = upd_center || {};

		var delta = Math.max(Math.abs((upd_center.lng || 0) - (prev_center.lng || 0)), Math.abs((upd_center.lat || 0) - (prev_center.lat || 0)));

		// enough for update
		return delta >= 0.0015;
	};

	var Xpo = function Xpo($scope, $state, $q, readiness, hprFactory, aggloItemRepo, firmListRepo, servGroupRepo, q_ll, q_z, q_g, q_spec) {
		_classCallCheck(this, Xpo);

		// do not load data for crawlers' requests
		// it is disallowed for crawlers in robots.txt /map
		if (typeof window.callPhantom === 'function') {
			// before any data loading: no overflow for 2gis limits
			readiness.serverError(new Error('forbiddenForCrawlers'));
			return;
		} else {
			readiness.ok('Карта мастеров и салонов красоты', 'Местоположение, адреса и контактные данные мастеров и салонов красоты');
		}

		servGroupRepo.retrieveData().then(function (arr) {
			$scope.arr_serv_group = arr;
		});

		$scope.q_spec = q_spec;

		if (!q_spec) {
			// show rubrics to select
			// or redirect to separated page
			return;
		}

		var calcAutoCoords = function calcAutoCoords() {
			return $q.when({
				lng: 37.6,
				lat: 55.75
			});
		};

		var calcCoords = function calcCoords(llTemp, gTemp) {
			if (llTemp) {
				var centerCoords = parseLngLat(llTemp);
				if (centerCoords) {
					return $q.when(centerCoords);
				} else {
					llTemp = null;
					// next check-in
				}
			}

			//else

			if (gTemp) {
				// auto define coords
				// if inside a city - use it
				// else - use center coords of a city
				console.log('calcByG', gTemp);
				return aggloItemRepo.retrieveByLocalName(gTemp).then(function (tmpAgglo) {
					console.log('byLocalName', tmpAgglo);
					return hprFactory.coordsFromWktPoint(tmpAgglo.centroid);
				}).catch(function (errAgglo) {
					if (errAgglo.status === 404) {
						return calcAutoCoords();
					} else {
						// notFound, or smth else
						console.log('errAgglo', errAgglo);
						return $q.reject(errAgglo);
					}
				});
			}

			//else {

			// if (!q_ll && !q_g){
			// try to define auto coords
			// use it
			return calcAutoCoords();
		};

		// these coordinates
		// - from url
		// - autodefine + default
		// - from city name from a url: center coords
		//$scope.map_zoom = 14;
		// $scope.map_center = {
		// 	lat: 43.60789763655921,
		// 	lng: 39.744629859924316
		// };

		calcCoords(q_ll, q_g).then(function (tmpCenter) {
			$scope.startLng = tmpCenter.lng;
			$scope.startLat = tmpCenter.lat;
			$scope.startZoom = parseZoom(q_z) || 14;
			//console.log('tmpCenter', tmpCenter);
		}).catch(function (errMap) {
			console.log('errMap', errMap);
			$scope.errMap = {
				msg: "some error"
			};
		});

		var cbkMarker = function cbkMarker(markObj, val) {
			// var dscUrl = '/id' + val.id + '?tpe=map&hash=' + val['hash'] +
			// 	  '&name=' + val['name'];

			var dscUrl = '/fid' + val.id + '?tpe=map' + '&hash=' + val['hash'] + '&name=' + val['name'];
			//
			//onclick="window.fillMapItem(this, '${val.id}', '${val.hash}')"
			var dscBtn = '<a class="map-item__msg-link"\n href="' + dscUrl + '">карточка салона</a>';

			var microCmnt = '';
			// microcomment: usually undefined,
			// or contain rubrics
			if (val.micro_comment) {
				// Микрокомментарий (70 символов), присутствует
				// в выдаче только для рекламных фирм. Позволяет
				// акцентировать внимание пользователя сервиса
				// на определенной организации в общем списке,
				// размещается под ее названием.
				// Пример: Деревянные окна и оконные блоки под ключ.
				microCmnt = '<div><span class="map-item__comment">' + val.micro_comment + '</span></div>';

				if (val.fas_warning) {
					// write it under micro_comment
					microCmnt += '<div><span class="map-item__warning">' + val.fas_warning + '</span></div>';
				}

				microCmnt += '</div>';
			}

			var dsc = '<div class="map-item">' + '<div class="map-item__name"><strong>' + val.name + '</strong></div>' + '<div class="map-item__dscr">' +
			// '&#x2302;&nbsp;' +
			val.address + '</div>' + microCmnt +
			//'<div>Метров: ' + val.dist + '</div>' +
			// rubricSet + // move to full profile
			'<div class="map-item__link-wrap">' + dscBtn + '</div>' + '</div>';

			//  iconUrl: val.micro_comment ? 'img/marker-icon-purple.png' : 'img/marker-icon.png',
			//    var iconOptions = {
			//iconSize: [100,100]
			//  };
			// TODO: calc icon from rubrics
			//          iconUrl: val.micro_comment ? 'img/marker-icon-purple.png' : 'img/marker-icon.png',
			//          shadowUrl: 'img/marker-shadow.png'

			// iconSize: [50, 50],
			//shadowSize: [50, 64]
			// iconAnchor: [22, 94],
			// shadowAnchor: [4, 62]

			markObj[val.id] = {
				lat: parseFloat(val.lat),
				lng: parseFloat(val.lon),
				// compileMessage: true,
				message: dsc,
				title: val.name + ' | ' + val.address
				//  icon: iconOptions

				// icon: {
				//   type: 'extraMarker',
				//   icon: 'fa-star',
				//   color: '#f00',
				//   prefix: 'fa',
				//   shape: 'circle'
				// }
			};
		};

		/**
   * Arr - array from GIS
   */
		var arrToMarkers = function arrToMarkers(arr) {
			// { m1: {lat..lng..}, m2:
			var markObj = {};
			angular.forEach(arr, angular.bind(null, cbkMarker, markObj));
			return markObj;
		};

		var cbkFirmList = function cbkFirmList(r) {
			$scope.mapMarkers = arrToMarkers(r.result);
			$scope.total = r.total;
		};

		// ll=37.6,55.75
		$scope.mapMove = function (upd_lng, upd_lat, upd_zoom, prev_lng, prev_lat) {
			// 	prev_zoom
			//var cntr = event.targetScope.center;
			//console.log('handleMove', upd_center, upd_zoom);
			$state.go("byt.map", {
				ll: fromCoordsToStr(upd_lng, upd_lat),
				z: upd_zoom,
				g: null,
				spec: q_spec
			}, {
				// If true will broadcast $stateChangeStart
				//    and $stateChangeSuccess events.
				notify: false,
				// update url and also replace last history record
				location: 'replace'
			});

			if (upd_zoom < 14) {
				console.log('zoom >= 14 required');
				return;
			}

			// load new companies, if moved more than 100 meters
			var isEnough = checkEnough({
				lng: prev_lng,
				lat: prev_lat
			}, {
				lng: upd_lng,
				lat: upd_lat
			});

			console.log('isEnough', isEnough);

			if (!isEnough) {
				console.log('not enough space to load new data');
				return;
			}

			firmListRepo.retrieveData(upd_lng, upd_lat, q_spec).then(cbkFirmList).catch(function (err) {
				console.log('error', err);
				alert('Ошибка загрузки данных. Попробуйте позже');
			});

			// calculate a city by coords
		};
	};

	angular.module('myApp.AppMapController', ['myApp.readiness', 'myApp.lflMap', 'myApp.hprFactory', 'myApp.aggloItemRepo', 'myApp.firmListRepo', 'myApp.servGroupRepo']).controller('AppMapController', ['$scope', '$state', '$q', 'readiness', 'hprFactory', 'aggloItemRepo', 'firmListRepo', 'servGroupRepo', 'q_ll', 'q_z', 'q_g', 'q_spec', Xpo]);
})(window.angular);
'use strict';

// analytics-on
// analytics-category="locdef"
// analytics-event="locdef-manual">

(function (angular, lytic) {
	'use strict';

	var drct = function drct() {

		// https://github.com/angulartics/angulartics/blob/master/src/angulartics.js
		var linkFunc = function linkFunc(scope, elems, attrs) {
			// 'click' by default
			var eventType = attrs.analyticsOn || 'click';

			//console.log('andrct', eventType);

			var cbkBind = function cbkBind() {
				//$event
				// var props = {
				//   eventType: $event.type
				// };

				// $analytics.eventTrack(eventName, trackingData);
				lytic.trackEvent(attrs.analyticsEvent || 'no-action', attrs.analyticsCategory || 'no-category', {});
			};

			angular.element(elems[0]).bind(eventType, cbkBind);
		};

		return {
			restrict: 'A',
			link: linkFunc
		};
	};

	angular.module('myApp.analyticsOn', []).directive('analyticsOn', drct);
})(window.angular, window.LYTIC);
'use strict';

(function (angular, lytic) {
  'use strict';

  /**
   * Verification code expiration, in seconds
   * @type {Number}
   */

  var EXPIRE_VCODE = 180;

  /**
   * @param {String} ename - Element tag, like 'div', 'a'
   * @param {String} cl - Class name
   * @param {String|[]Object} content - Html or array of child elements
   * @returns A new html element
   */
  var gen = function gen(ename, cl, content) {
    var obj = document.createElement(ename);
    if (cl) {
      obj.className = cl;
    }
    if (content) {
      if (Array.isArray(content) && content.length > 0) {
        // children
        content.forEach(function (item) {
          obj.appendChild(item);
        });
      } else {
        obj.innerHTML = content;
      }
    }
    return obj;
  };

  var el = {
    div: function div(cl, content) {
      return gen('div', cl, content);
    },
    form: function form(cl, content) {
      return gen('form', cl, content);
    },
    button: function button(cl, content) {
      return gen('button', cl, content);
    },
    label: function label(cl, content) {
      return gen('label', cl, content);
    },
    // elems without content
    input: function input(cl) {
      return gen('input', cl);
    }
  };

  var drct = function drct($state, $interval, lgr, apimas, sessRepo) {

    /**
     * @param {Object} apimas - API endpoints for masters
     * @param {Function} next - Callback after PIN will be sended
     */
    var getVcodeForm = function getVcodeForm(next) {
      var frm = el.form('frm');

      // input PIN
      var lblEmail = el.div(null, 'Укажите имэйл адрес:');
      var inpEmail = el.input();
      inpEmail.autofocus = true;
      inpEmail.type = 'email';
      inpEmail.required = true;

      var wrapEmail = el.div('frm__inp', [inpEmail]);

      frm.appendChild(lblEmail);
      frm.appendChild(wrapEmail);

      // button PIN
      var btnPin = el.button('app-button', 'Получить код для входа');
      btnPin.disabled = true;

      var emailPrev = '';
      var handleBtnPin = function handleBtnPin(emailCur) {
        //var emailCur = evt.target.value;

        // it allows to ignore non-symbol keys, like Enter, Tab
        // and do not disable/enable if no changes
        if (emailCur === emailPrev) {
          return;
        }

        emailPrev = emailCur;

        if (emailCur) {
          btnPin.disabled = false;
        } else {
          btnPin.disabled = true;
        }
      };

      // button depends on input
      inpEmail.addEventListener('change', function (evt) {
        return handleBtnPin(evt.target.value);
      });
      inpEmail.addEventListener('keyup', function (evt) {
        return handleBtnPin(evt.target.value);
      });

      var wrapBtn = el.div('frm__but', [btnPin]);
      frm.appendChild(wrapBtn);

      /**
       * Send a request to API: verification code
       */
      var sendReq = function sendReq() {
        var tmpEmail = inpEmail.value;

        if (!tmpEmail) {
          return;
        }

        btnPin.disabled = true;
        // it is just sends a request to the server
        // it is NOT handles a response

        var errVcode = function errVcode(status, edata) {
          switch (status) {
            case 422:
              switch (edata.errkey) {
                case "validationError":
                  var dtls = edata.details || {};
                  switch (dtls.property) {
                    case "lgn":
                      return "Требуется указать корректный имэйл";
                    case "lgn_again":
                      return "Требуется указать корректный повторный имэйл, совпадающий с основным";
                  }
                  break;
                case "duplicateKeyError":
                  return "На указанный имэйл ранее уже был отправлен проверочный код: для повторной отправки необходимо подождать некоторое время";
              }
              break;
          }

          // send a error to admin
          lgr.crit('errSendVcodeEmail', 'unknown error', {
            status: status,
            edata: edata
          });

          return 'Непредвиденная ошибка: попробуйте повторить позже';
        };

        /**
         * Generate a pin by email
         * - validate email
         * - find a master by email (create if not)
         * - generate a pin, save it
         * - send it by this email
         * - activate/show an input for a pin
         * - activate Login Button when a pin is not null
         */
        apimas.sendVcodeEmail(tmpEmail).then(function (result) {
          // return the initial state
          btnPin.disabled = false;
          next(result);

          lytic.trackEvent('vcode-email', 'login', {});
        }).catch(function (err) {
          alert(errVcode(err.status, err.data));
          btnPin.disabled = false;
        });
      };

      // server action depends on
      // - form submit
      // - input value
      frm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        sendReq();
      });

      return frm;
    };

    /**
     * Generate a login form
     * @param {Object} apimas - API endpoints for masters
     * @param {String} email
     * @param {Function} callback
     * @param {Object} previous form to return
     * @returns {Object} form wrap
     */
    var getLoginForm = function getLoginForm(email, next, prevForm) {
      var frmWrap = el.div();
      var frm = el.form('frm');

      var divEmail = el.div('mrgn', "Укажите проверочный код, который был выслан на имэйл <b>" + email + "</b>");

      //    var lblPin = el.label(null, "Укажите проверочный код:");
      var inpPin = el.input();
      inpPin.type = 'number';
      inpPin.min = 1;
      inpPin.max = 99999;
      inpPin.style.width = "120px";

      inpPin.required = true;
      inpPin.autofocus = true;

      var wrapInpPin = el.div('frm__inp', [divEmail, inpPin]);

      frm.appendChild(wrapInpPin);

      var btnLogin = el.button('app-button', 'Войти');
      btnLogin.disabled = true;
      var wrapBtnLogin = el.div('frm__inp', [btnLogin]);
      frm.appendChild(wrapBtnLogin);

      var pinPrev = '';
      var handleBtnLogin = function handleBtnLogin(evt) {
        var pinCur = evt.target.value;

        // allows to ignore non-symbol keys
        if (pinCur === pinPrev) {
          return;
        }

        pinPrev = pinCur;

        if (pinCur) {
          btnLogin.disabled = false;
        } else {
          btnLogin.disabled = true;
        }
      };

      inpPin.addEventListener('change', handleBtnLogin);
      inpPin.addEventListener('keyup', handleBtnLogin);

      var sendReq = function sendReq() {
        var tmpPin = inpPin.value;

        if (!tmpPin) {
          return;
        }

        btnLogin.disabled = true;
        // it is just sends a request to the server
        // it is NOT handles a response

        var errLogin = function errLogin(status, edata) {
          switch (status) {
            case 422:
              switch (edata.errkey) {
                case 'validationError':
                  var dtls = edata.details || {};
                  switch (dtls.property) {
                    case 'lgn':
                      return 'Необходимо указать корректный имэйл';
                    case 'vcode':
                      return 'Необходимо указать корректный проверочный код';
                  }

                  switch (dtls.code) {
                    case 'errLgnNotFound':
                      return 'Не найдено проверочного кода для указанного имэйла: возможно срок действия кода уже истёк: попробуйте получить код заново';
                    case 'errMaxRetry':
                      return 'Превышено максимальное количество попыток неверного входа: проверочный код удалён: попробуйте получить код заново';
                    case 'errMismatch':
                      return 'Указан неверный проверочный код: проверьте корректность кода';
                  }

                  break;
              }
              break;
          }

          lgr.crit('errSendLoginEmail', 'unknown error', {
            status: status,
            edata: edata
          });

          return 'Непредвиденная ошибка: попробуйте повторить позже';
        };

        /**
         * Generate a pin by email
         * - validate email
         * - find a master by email (create if not)
         * - generate a pin, save it
         * - send it by this email
         * - activate/show an input for a pin
         * - activate Login Button when a pin is not null
         */
        apimas.sendLoginEmail(email, tmpPin).then(function (result) {
          btnLogin.disabled = false;
          next(result);

          lytic.trackEvent('login-email', 'login', {});
        }).catch(function (err) {
          alert(errLogin(err.status, err.data));
          btnLogin.disabled = false;
        });
      };

      // server action depends on
      // - form submit
      // - input value
      frm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        sendReq();
      });

      var lblDscr = el.label(null, "Если не получили код, попробуйте: ");

      var btnOtherEmail = el.button('mrgn', 'указать другой имэйл<br/><small>вернуться</small>');
      var btnOtherCode = el.button('mrgn', '');

      btnOtherEmail.addEventListener('click', function () {
        prevForm();
      });

      var startWait = function startWait(wait) {
        btnOtherCode.disabled = true;
        var setWaitText = function setWaitText() {
          btnOtherCode.innerHTML = 'получить код повторно<br/><small>через ' + wait + ' сек.</small>';
        };

        var inval;

        var cbkInterval = function cbkInterval() {
          if (wait > 0) {
            setWaitText();
          } else {
            window.clearInterval(inval);
            btnOtherCode.innerHTML = 'получить другой код<br><small>на имэйл: ' + email + '</small>';
            btnOtherCode.addEventListener('click', function () {
              prevForm();
            });
            btnOtherCode.disabled = false;
          }

          wait -= 1;
        };

        inval = window.setInterval(cbkInterval, 1000);
        // run at current moment
        cbkInterval();
      };

      startWait(EXPIRE_VCODE);

      var wrapDscr = el.div('frm__btn', [lblDscr, btnOtherEmail, btnOtherCode]);

      frmWrap.appendChild(frm);
      frmWrap.appendChild(wrapDscr);

      return frmWrap;
    };

    /**
     * Handle successfull login
     */
    var cbkSuccessUpdate = function cbkSuccessUpdate() {
      var sessData = sessRepo.getData();
      lgr.info('sessionUpdate', 'success', sessData);

      if (sessData.is_editor) {
        $state.go('byt.welcome');
      } else {
        // if is_supplier
        // uid must be not null (after log-in)
        $state.go('byt.splrItem.main', {
          supplier_id: sessData.uid
        });
      }
    };

    return {
      restrict: 'A',
      link: function link(scope, elems) {
        // attrs

        // ideally: two forms:
        // - for a PIN
        //   - emailInput
        //   - buttonGetPin
        //   - description of a process
        // - for a LOGIN
        //   - emailString
        //   - pinInput
        //   - buttonLogin (disable while no pin)
        //   - retryPinButton (near the pinInput)
        //   - returnToFirstForm (near the emailString)

        // No separate routes for these forms
        //   - route: /login-email?em=123 is a bad practice to show email

        // if a user enters a email the forms will be switched
        // it this is a wrong email
        //   - a user must returns to the first form

        var wrap = elems[0];

        var frmVcode = getVcodeForm(function (result) {

          // hide a vcode form
          // show a login form
          var frmLogin = getLoginForm(result.lgn, function (authResult) {
            sessRepo.updateSess(authResult.auth_token).then(cbkSuccessUpdate).catch(function (reason) {
              // send to admin
              lgr.crit('errUpdateSess', 'login-email', reason);
              alert(reason);
            });

            lgr.info('authResult', 'login-email', authResult);
          }, function () {
            // return to the first form
            wrap.innerHTML = "";
            wrap.appendChild(frmVcode);
          });
          wrap.innerHTML = "";
          wrap.appendChild(frmLogin);
        });

        wrap.appendChild(frmVcode);
      }
    };
  };

  angular.module('myApp.appLoginEmail', ['myApp.apimas', 'myApp.sessRepo']).directive('appLoginEmail', ['$state', '$interval', 'lgr', 'apimas', 'sessRepo', drct]);
})(window.angular, window.LYTIC);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
  'use strict';

  // percent of filling of a profile
  // no services here: separated - required to show in catalogs
  // no min and max limits: validation is separated process

  var profileFilling = {
    bio: {
      arr: ['bio'],
      percent: 20,
      msg: 'описание, биография'
    },
    address: {
      arr: ['address'],
      percent: 20,
      msg: 'адрес, местонахождение'
    },
    any_phone: {
      arr: ['phone', 'landline', 'whatsapp', 'viber'],
      percent: 20,
      msg: 'любой телефон для связи: мобильный, стационарный, viber или whatsapp'
    },
    any_site: {
      arr: ['vkprofile', 'instagram', 'website', 'vkontakte', 'facebook', 'odnoklassniki'],
      percent: 20,
      msg: 'ссылка на сайт, личная или публичная страница в социальных сетях'
    },
    any_chat: {
      arr: ['skype', 'twitter', 'viber', 'whatsapp', 'email'],
      percent: 20,
      msg: 'средство связи: скайп, твиттер, viber, whatsap или имэйл'
    }
  };

  var calcFromContacts = function calcFromContacts(contacts, address, bio) {
    var obj = {};
    contacts.forEach(function (c) {
      obj[c.type] = c.value;
    });

    obj['address'] = address;
    obj['bio'] = bio;
    return obj;
  };

  var Cmp = function Cmp() {
    _classCallCheck(this, Cmp);

    console.log('hello from app splr fill', this.contacts);

    if (!Array.isArray(this.contacts)) {
      return;
    }

    var obj = calcFromContacts(this.contacts, this.address, this.bio);

    var percent = 0;
    var notEnough = [];

    Object.keys(profileFilling).forEach(function (fillingKey) {
      var prof = profileFilling[fillingKey];
      var isGroupExists = prof.arr.some(function (item) {
        return !!obj[item];
      });

      if (isGroupExists) {
        percent += prof.percent;
      } else {
        notEnough.push(prof);
      }
    });

    this.percent = percent;

    this.notEnough = notEnough;
  };

  angular.module('myApp.appSplrFill', []).component('appSplrFill', {
    template: '\n<div>\n<div class="pdng" ng-if="$ctrl.notEnough.length"\n  style="background-color: #e91e63; color: #efefef">\n  Профиль заполнен на <b>{{$ctrl.percent}}%</b>\n<br>\n  Более полное заполнение профиля поднимает мастера во всех каталогах и фотогалереях. Рекомендуем заполнить следующие данные:\n<ul>\n  <li ng-repeat="ne in $ctrl.notEnough">\n    <b>{{ne.percent}}%</b> - {{ne.msg}}\n  </li>\n</ul>\n</div>\n</div>\n',
    controller: Cmp,
    bindings: {
      contacts: '<',
      address: '<',
      bio: '<'
    }
  });
})(window.angular);
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
	'use strict';

	var Xpo = function Xpo($scope, $state) {
		_classCallCheck(this, Xpo);

		$scope.hrefHome = $state.href("byt.welcome");

		$scope.calcHrefAgglo = function (aggloName) {
			return $state.href("byt.aggloItem.specList", {
				agglo_local_name: aggloName
			});
		};

		$scope.calcHrefSpec = function (aggloName, specName) {
			return $state.href("byt.aggloItem.specItem.rubricList", {
				agglo_local_name: aggloName,
				spec_name: specName
			});
		};

		$scope.calcHrefSplr = function (splrId, splrName) {
			return $state.href("byt.splrItem", {
				supplier_id: splrId,
				name: splrName
			});
		};

		$scope.calcHrefRubric = function (aggloName, specName, rubricName, rviewId) {
			return $state.href("byt.aggloItem.specItem.rubricItem." + rviewId + "View", {
				agglo_local_name: aggloName,
				spec_name: specName,
				rubric_name: rubricName
			});
		};
	};

	var linkFunc = function linkFunc(scope, elems) {
		// attrs
		var wrap = elems[0];
		console.log('wrap', wrap);
		// scrollWidth = readonly
		// if there are scroll bars for scrolling through the content), the scrollWidth is larger than the clientWidth.
		console.log('scroll', wrap.scrollWidth, wrap.scrollLeft);
		window.setTimeout(function () {
			wrap.scrollLeft = wrap.scrollWidth;
		}, 100);
		//elems[0].scrollWidth;

		//console.log('scroll', elems[0].scrollWidth, elems[0].scrollLeft);
	};

	var drct = function drct() {
		return {
			restrict: 'A',
			scope: {
				aggloName: '=',
				specName: '=',
				rubricName: '=',
				rviewId: '=',
				rviewName: '=',
				splrId: '=',
				splrName: '='
			},
			templateUrl: 'drct/breadcrumb.tpl.html',
			controller: ['$scope', '$state', Xpo],
			link: linkFunc
		};
	};

	angular.module('myApp.breadcrumbDrct', []).directive('breadcrumbDrct', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	angular.module('myApp.drct', []).directive('onFinishRender', ['$timeout', function ($timeout) {
		return {
			restrict: 'A',
			link: function link(scope, element, attr) {
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
"use strict";

(function (angular) {
	'use strict';

	// class Xpo{
	// 	constructor($scope){

	// 	}
	// }

	var drct = function drct(apimas) {
		var linkFunc = function linkFunc(scope, elem, attrs) {
			var raw = elem[0];
			//console.log(elem.parent().width());
			// console.log(elem);
			// console.log(raw);
			// console.log(attrs);

			var block;
			if (document.createElement("detect").style.objectFit === "") {
				block = document.createElement('img');

				if (attrs.workId) {
					block.onerror = function (ev) {
						// disable next onerror:
						//   in cases where this function is failed
						block.onerror = null;
						// console.log('img err');
						// console.log(err);
						console.log('img err', ev);

						// no need to handle a response (error or no)
						apimas.sendReportNoImage({ id: attrs.workId });
						// send a report to a server
					};
				}
				block.src = attrs.imgSrc;
			} else {
				block = document.createElement('div');
				block.style.backgroundImage = 'url(' + attrs.imgSrc + ')';
			}

			raw.appendChild(block);
		};

		return {
			restrict: 'A',
			link: linkFunc
			// scope: {
			// 	item: '='
			// },
			//templateUrl: '',
			// controller: [
			// 	'$scope',
			// 	Xpo
			// ]
		};
	};

	angular.module('myApp.fullSizeImg', ['myApp.apimas']).directive('fullSizeImg', ['apimas', drct]);
})(window.angular);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular, SNNS) {
	'use strict';

	var Xpo = function Xpo($scope) {
		_classCallCheck(this, Xpo);

		/**
   * Whether to show a button 'add to a left link'
   * - and there is a method to add it
   * - and there is a method to check a link
   * - if no left links yet
   * @type {boolean}
   */
		$scope.is_show = !!SNNS.showLeftLinkBox && !!SNNS.isLeftLink && !SNNS.isLeftLink();

		$scope.showLeftLinkBox = function () {
			if (!$scope.is_show) {
				return;
			}

			SNNS.showLeftLinkBox();
			// if a user changes permissions, isLeftLink() will be changed too
			// hide: no need again
			// SNNS.is_left_link = true; // no such property already
			// re-calculate manually (no auto for non-angular props)
			$scope.is_show = false;
		};
	};

	var drct = function drct() {
		return {
			restrict: 'A',
			templateUrl: 'drct/left-link.tpl.html',
			controller: ['$scope', Xpo]
		};
	};

	angular.module('myApp.leftLinkDrct', []).directive('leftLinkDrct', [drct]);
})(window.angular, window.snns);
'use strict';

(function (angular) {
	'use strict';

	var drct = function drct($compile, $location) {

		var linkFunc = function linkFunc(scope, elem) {
			// , attrs

			var raw = elem[0];

			// set focus to use page down, page up

			elem.bind('scroll', function () {
				// fix for smooth scrolling (1px interval)
				// execute it with some interval: 30px
				// usually: bottom/up arrow executes approx 40px
				if (Math.abs(scope.vpos.val - raw.scrollTop) > 30) {
					//console.log('scroll fired', raw.scrollTop);
					scope.vpos.val = raw.scrollTop;
					scope.$apply();
				}
				return true;
			});

			/**
    * Scroll to the top of the window
    */
			scope.scrollToStart = function () {
				//console.log('scroll to start');
				$location.hash('');
				scope.vpos.val = 1;
				// alternative
				// raw.scrollTop = 0;
				// it executes elem.bind('scroll')
			};

			// scrollTop of wrap assigned only here
			scope.$watch('vpos.val', function (tmpVal) {
				//console.log('directive vpos', tmpVal);
				raw.scrollTop = tmpVal;
				raw.focus();
			});

			var btnTop = angular.element('\n  <div class="scroll-top-wrap" ng-show="vpos.val > 300">\n\t<button ng-click="scrollToStart()"\n\t\t\ttitle="наверх"\n\t\t\tclass="app-button scroll-top-btn"\n\t\t\tanalytics-on\n\t\t\tanalytics-category="scroll"\n\t\t\tanalytics-event="scroll-top">\n\t  <span class="fa fa-arrow-up fa-2x">\n\t  </span>\n\t</button>\n  </div>');

			$compile(btnTop)(scope);
			elem.append(btnTop);
		};

		return {
			restrict: 'A',
			link: linkFunc,
			scope: {
				vpos: '=appVpos'
			}
		};
	};

	angular.module('myApp.appScrollWatcher', []).directive("appScrollWatcher", ['$compile', '$location', drct]);
})(window.angular);

// 	angular.element($window).bind("scroll",
// function(){
// 	  if (this.pageYOffset >= 100) {
// 	    scope.boolChangeClass = true;
// 	    console.log('Scrolled below header.');
// 	  } else {
// 	    scope.boolChangeClass = false;
// 	    console.log('Header is in view.');
// 	  }
// 	  scope.$apply();
// 	});
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular, APPCONF) {
  'use strict';

  var Xpo = function Xpo($scope, $location, $state, lgr, apimas, aggloItemRepo, servGroupRepo, readiness) {
    _classCallCheck(this, Xpo);

    if (!$scope.mediaId) {
      readiness.serverError(new Error('no media id'));
      return;
    }
    //console.log('media');

    // do not redirect: need to stay the same page
    //  but with 404 error for crawlers
    //window.location.replace('/404.html');
    //return;
    // the same as $location.href (which deprecated)
    // $window.location.href equals a previous url if redirected
    //  (from catalog for example) - strange
    // $location.url

    $scope.is_vk_share = !!window.VK;

    $scope.is_vk_like = !!window.VK;

    // fb, vk, ok, etc.
    // share, wall, like, etc.

    var cbkErrLoad = function cbkErrLoad(err) {
      switch (err.status) {
        case 404:
          // if not found
          $scope.err_msg = 'Фото или видео не найдено. Возможно было удалено мастером или модератором.';
          readiness.notFound();
          break;
        default:
          $scope.err_msg = 'Технические неполадки. Попробуйте позже';
          readiness.serverError(err);
          break;
      }
    };

    var calcServGroupName = function calcServGroupName(id) {
      if (!$scope.arr_serv_group) {
        return null;
      }

      var servGroup = $scope.arr_serv_group.filter(function (item) {
        return item.id === id;
      })[0];

      if (!servGroup) {
        return null;
      }

      return servGroup.name;
    };

    $scope.calcHrefRubric = function (aggloLocalName, servGroupId, servRubricName) {

      return $state.href('byt.aggloItem.specItem.rubricItem.tblView', {
        agglo_local_name: aggloLocalName,
        spec_name: calcServGroupName(servGroupId),
        rubric_name: servRubricName
      });
    };

    var readyAll = function readyAll() {
      // 'Фотография работы ' + $scope.sw.id +
      //              ' - ' + $scope.sw.serv_rubric_name +
      //              ' - мастер / салон красоты: ' +
      //              $scope.sw.master_profile_name
      var metaDscr = 'Работа №' + $scope.sw.id;

      metaDscr += '. Мастер / салон красоты: ' + $scope.sw.master_profile_name;

      if ($scope.sw.city_name) {
        if ($scope.sw.city_name_genitive) {
          metaDscr += ' из ' + $scope.sw.city_name_genitive;
        } else {
          metaDscr += ' из города ' + $scope.sw.city_name;
        }
      }

      // remove smiles and other non
      //var clearWords = clearEmoji($scope.sw.words);

      // var arrWords = $scope.sw.words.match(/\S+/g);
      // angular.forEach(arrWords, function(wordItem){
      //   if ((metaDscr.length + wordItem.length) < 150){
      //     metaDscr += ' ' + wordItem;
      //   }
      // });

      angular.forEach($scope.sw.arr_serv_rubric, function (rbr) {
        if (metaDscr.length + rbr.name.length < 150) {
          metaDscr += ' - ' + rbr.name;
        }
      });

      // if (metaDscr >= 150) {
      //   metaDscr += '...';
      // } else {
      //   // 155 - optimal
      //   angular.forEach($scope.sw.tags, function(tagItem){
      //     if ((metaDscr.length + tagItem.length) < 150){
      //       metaDscr += ' #' + tagItem;
      //     }
      //   });
      // }

      var metaTtl = 'Фото ' + $scope.sw.id;
      if ($scope.sw.main_serv_rubric) {
        metaTtl += ' - ' + $scope.sw.main_serv_rubric.name;
      }
      metaTtl += ' - ' + $scope.sw.master_profile_name;

      if ($scope.sw.city_name) {
        metaTtl += ' - ' + $scope.sw.city_name;
      }

      // add master info to title and description
      readiness.ok(metaTtl, metaDscr, $state.href('byt.mediaItem', {
        media_id: $scope.sw.id
      }));

      //ttl: 'Фото {serv_rubric_name} - {name} - работа {serv_work_id}',
      //dscr: 'Фотография {serv_rubric_name} от мастера / салона красоты: {name}. Идентификатор работы: {serv_work_id}'
    };

    var scopeOther = function scopeOther() {
      //var tmpObj = moderateDscr($scope.sw.description);
      //$scope.sw.words = tmpObj.words.join(' ');

      //$scope.sw.tags = tmpObj.tags;

      //var fullDscr = $scope.sw.words;

      //angular.forEach($scope.sw.tags, function(tagItem){
      //  fullDscr += ' #' + tagItem;
      //});

      //$scope.sw.fullDscr = fullDscr;

      $scope.link_supplier = $state.href('byt.splrItem.main', {
        supplier_id: $scope.sw.master_profile_id,
        name: $scope.sw.master_profile_name
      });

      var link_media = $state.href('byt.mediaItem', {
        id: $scope.sw.id
      });

      //'/media/' + $scope.sw.id;
      $scope.url_to_share = APPCONF.MAIN_HOST + link_media;

      // ordered by priority
      $scope.sw.main_serv_rubric = $scope.sw.arr_serv_rubric[0];
    };

    var attachAgglo = function attachAgglo() {
      var ma = $scope.sw.master_address;
      if (!ma) {
        // nothing attach
        return null;
      }

      return aggloItemRepo.retrieveById(ma.geo_district_id).then(function (agg) {
        $scope.sw.city_name = agg.local_name;
        $scope.sw.city_name_genitive = agg.case_genitive;
        $scope.sw.city_name_prepositional = agg.case_prepositional;
      }).catch(function (err) {
        // ignore err, send to admin
        lgr.crit('aggloItemRetrieve', 'from media-item', {
          msg: err.message
        }, err.stack);
      });
    };

    // load info for a work: description, prices, etc.
    // description already loaded for tblView, masterView
    var loadServWork = function loadServWork() {
      return apimas.sendGet('/work/get-item', {
        id: $scope.mediaId // servWorkId
      }).then(function (r) {
        // if not exists - 404 error in catch block
        $scope.sw = r;

        // $scope.sw.embed_link = $sce.trustAsResourceUrl($scope.sw.side_link + 'embed/');
      });
      // .then(translateRubric)
      // .then(readyAll)
    };

    var loadServGroups = function loadServGroups() {
      return servGroupRepo.retrieveData().then(function (arr) {
        $scope.arr_serv_group = arr;
      });
    };

    var loadWorkRubrics = function loadWorkRubrics() {
      return apimas.sendGet('/work/get-rubrics', {
        serv_work_id: $scope.sw.id,
        locale_id: 'ru'
      }).then(function (r) {
        $scope.sw.arr_serv_rubric = r.arr_serv_rubric;
      }).catch(function (e) {
        // skip errors from work rubrics:
        // it is a second priority on a page

        // just set to empty
        $scope.sw.arr_serv_rubric = [];

        lgr.crit('mediaGetRubrics', 'loadWorkRubrics', {
          msg: e.message
        }, e.stack);
      });
    };

    loadServWork().then(loadServGroups).then(loadWorkRubrics).then(attachAgglo).then(scopeOther).then(readyAll).catch(cbkErrLoad);
  };

  var drct = function drct() {
    return {
      restrict: 'A',
      scope: {
        mediaId: '@'
      },
      templateUrl: 'media-item/media-item.tpl.html',
      controller: ['$scope', '$location', '$state', 'lgr', 'apimas', 'aggloItemRepo', 'servGroupRepo', 'readiness', Xpo]
    };
  };

  angular.module('myApp.mediaItemDrct', ['myApp.ytbVideo', 'myApp.apimas', 'myApp.readiness', 'myApp.appVkLike', 'myApp.fullSizeImg', 'myApp.aggloItemRepo', 'myApp.servGroupRepo']).directive('mediaItemDrct', [drct]);
})(window.angular, window.APPCONF);

// $scope.isWallPost = !!(SNNS.wallPost);

// $scope.wallPost = function(tmpSupplier, tmpMsrv, tmpSw){
//   if (!$scope.isWallPost){
//     return;
//   }

//   SNNS.wallPost(tmpMsrv.serv_rubric_name + ': ' + tmpSupplier.name, 'main-host/id' + tmpSupplier.id + '/' + encodeURIComponent(tmpMsrv.serv_rubric_name) + '/' + tmpSw.id + '?name=' + encodeURIComponent(tmpSupplier.name) + '&_escaped_fragment_=');
// };

// phantomjs bug
// case -1:
//   // if not found
//   $scope.err_msg = 'Фото или видео не найдено. Возможно было удалено мастером или модератором.';
//   readiness.notFound();
//   break;

// var clearEmoji = function(str){
//     return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
// };

// tags inside a text can not be removed: My city #Moscow
// icons can not be removed: I #like it
// Every exported media has associated tags in nstg
// var moderateDscr = function(str){
//     if (!str) {
//       return {
//         words: [],
//         tags: []
//       };
//     }
//     var arr = str.match(/\S+/g);
//     var tags = [];
//     var len = arr.length - 1;
//     for (var i = len; i >= 0; i--){
//       var tg = arr[i];
//       if (tg[0] === '#'){
//         // for cases #absdg#sdfbsd#wer
//         tg.split('#').forEach((innerTag) => {
//           if (innerTag.length > 1) {
//             tags.push(innerTag);
//           }
//         });

//         arr.splice(i,1);
//       } else {
//         // end of cycle
//         i = -1;
//       }
//     }

//     tags.sort(function(a,b){return a < b ? 1 : -1;});

//     // remove duplicates
//     var uniqueTags = tags.filter(function(item, pos){
//       return tags.indexOf(item) === pos;
//     });

//     // join by order
//     // uniqueTags.forEach(function(tag){
//     //   arr.push('#' + tag);
//     // });

//     //console.log(arr);

//     return {
//       words: arr,
//       tags: uniqueTags
//     };
//     //arr.join(' ');
// };
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular, SNNS, APPCONF) {
	'use strict';

	var Xpo =
	// qstn_id - is a set of previous answers
	function Xpo($scope, hprFactory) {
		_classCallCheck(this, Xpo);

		$scope.url_share = APPCONF.MAIN_HOST + hprFactory.encodePath($scope.quizItem.rel_url);

		$scope.image_share = APPCONF.MAIN_HOST + '/qimg/' + $scope.qresItem.photo + '.png';

		$scope.isWallPostQres = !!SNNS.wallPost;

		$scope.wallPostQres = function (qresItem) {
			if (!$scope.isWallPostQres) {
				return;
			}

			// build message

			var msg = '';

			var attch = '';

			if (qresItem.photo) {
				attch = qresItem.photo;
			}

			// msg = $scope.quizItem.ttl +
			// 	'\n' +
			// 	'\n' + qresItem.best +
			// 	'\n' + qresItem.worst +
			// 	'\n\n';
			// attch = 'photo-92002771_391408538';

			// Пользователи приложения ВКонтакте - на десктопах
			// Их друзья могут быть как на десктопах, так и на мобилах
			// Мобилы не поддерживают приложения
			// Данная ссылка только для десктопов и планшетов
			// На мобилах можно только лайкать
			msg += 'Пройти тест в приложении vk.com/app4863471 либо на сайте miskra.ru';

			//attch += ',https://miskra.ru';
			//attch += ',https://vk.com/app4863471';
			// no link - use a link in a message

			// link to app only for desktop users
			// use a link to site
			// but users prefer vk, than side links
			// attach image too
			SNNS.wallPost(msg, attch, function (err, postId) {
				// it is side library: need to re-scope
				if (err) {
					// it is a string
					if (err.message === '10007') {
						// skip it
						//   error_msg: "Operation denied by user"
					} else {
							alert('Возникла ошибка при сохранении. Повторите позже');
						}
					console.log(err);
					return;
				}
				console.log(postId);
				// hide a button
				alert('Результат успешно сохранён на вашей стене.');
			});
			// no attachmentUrl
			//console.log('posted', msg);
		};

		// var catchQres = function(err){
		// 	console.log(err);
		// 	$scope.qresErr = {
		// 	  msg: 'Непредвиденная ошибка: повторите запрос позже'
		// 	};
		// 	readiness.serverError(err);
		// };

		// quizSrvc.getQres($scope.qresId)
		// 	.then((qres) => {
		// 	  $scope.item = qres;
		// 	  readiness.ok('Результат №' + qres.id + ' теста: ' + $scope.quizItem.ttl,
		// 				   'Результат №' + qres.id + ': ' + qres.best.substring(0, 126) + '...');
		// 	})
		// 	.catch(catchQres);
	};

	var drct = function drct() {
		return {
			restrict: 'A', // only attribute
			templateUrl: 'quiz-item/qres-item.tpl.html',
			scope: {
				quizItem: '=',
				qresItem: '='
			},
			controller: ['$scope', 'hprFactory', Xpo]
		};
	};

	angular.module('myApp.qresItemDrct', ['myApp.appShareBlock', 'myApp.quizHelper', 'myApp.hprFactory']).directive('qresItemDrct', [drct]);
})(window.angular, window.snns, window.APPCONF);

// $location,
// $state,
// quizHelper

//console.log('qres-drct', $scope.suites);

// $scope.calcProductDscr = function(productTtl){

// 	var productItem = $scope.products.filter((prd) => {
// 	  return prd.ttl === productTtl;
// 	})[0];

// 	if (productItem){
// 	  return productItem.dscr;
// 	} else {
// 	  // no item or description
// 	  return '';
// 	}
// };
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// this view doesn't depends of previous questions

(function (angular) {
  'use strict';

  var Xpo =
  // qstn_id - is a set of previous answers
  function Xpo($scope) {
    _classCallCheck(this, Xpo);

    $scope.setAnswer = function (tmpQstn, tmpAnswer) {
      tmpQstn.user_answer = tmpAnswer;
    };
  };

  var drct = function drct() {
    return {
      restrict: 'A', // only attribute
      templateUrl: 'quiz-item/qstn-item.tpl.html',
      scope: {
        // qstn
        item: '='
        //@ simply reads the value (one-way binding)
      },
      controller: ['$scope', Xpo]
    };
  };

  angular.module('myApp.qstnItemDrct', []).directive('qstnItemDrct', [drct]);
})(window.angular);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular, APPCONF) {
	'use strict';

	var Xpo = function Xpo($scope, $state, readiness, quizSrvc) {
		_classCallCheck(this, Xpo);

		$scope.url_to_share = APPCONF.MAIN_HOST + $state.href("byt.quizItem.questionList");

		$scope.calcAnswerIds = function (tmpQuiz) {
			var answerIds = [];

			angular.forEach(tmpQuiz.question_list, function (qu) {
				if (qu.user_answer) {
					answerIds.push(qu.user_answer.id);
				}
			});

			return answerIds;
		};

		$scope.calcResult = function (tmpQuiz) {
			var answerIds = $scope.calcAnswerIds(tmpQuiz);

			if (answerIds.length !== tmpQuiz.question_list.length) {
				console.log('required all answers');
				return;
			}

			quizSrvc.calcQres(answerIds).then(function (quiz_result) {
				$scope.qresItem = quiz_result;
				//console.log('quiz_result', quiz_result);
				// $state.go("byt.quizItem.qresItem", {
				//   qres_id: quiz_result.id
				// });
				//$scope.quiz_result = quiz_result;
			}).catch(function (err) {
				console.log(err);
				alert('Непредвиденная ошибка: не удалось вычислить результат: попробуйте позже');
			});
		};

		// init
		// all questions already loaded in a parent controller
		readiness.ok('Тест: ' + $scope.quizItem.ttl, $scope.quizItem.dscr, $scope.quizItem.rel_url);
	};

	var drct = function drct() {
		return {
			restrict: 'A', // only attribute
			templateUrl: 'quiz-item/qstn-list.tpl.html',
			scope: {
				quizItem: '='
				//suites: '='
				//@ simply reads the value (one-way binding)
			},
			controller: ['$scope', '$state', 'readiness', 'quizSrvc',
			// '$location',
			Xpo]
		};
	};

	angular.module('myApp.qstnListDrct', ['myApp.qstnItemDrct', 'myApp.qresItemDrct', 'myApp.quizSrvc', 'myApp.appCommentForm', 'myApp.readiness']).directive('qstnListDrct', [drct]);
})(window.angular, window.APPCONF);

// $scope.answered_questions = [];
// $scope.unanswered_questions = [];

// if (qstn){
// 	console.log('here is a qstn', qstn);
// 	$scope.qstn = qstn;
// 	readiness.ok(qstn.ttl + ' - ' + quiz.ttl,
// 				 'Вопрос - ' + qstn.ttl + ' - ' + quiz.ttl);
// } else {

// nextQ and qResults depends of each other, but only
// in business logic, and not programmatically

//var quiz = $scope.item;
//console.log('quiz-drct',  quiz);
'use strict';

(function (angular) {
	'use strict';

	// select all variants and cons-variants
	// remove cons variants from pros
	// [{id:'hairform', answers: []...},]
	// [{q:'hairform', a:'thick'},]
	// it may be intermediate result
	//   not necessary to existence of all pass_answers

	var calcNextQuestion = function calcNextQuestion(questions, pans) {
		// ['faceform', 'hairform']
		// already answered
		var pansQuestionsIds = pans.map(function (pan) {
			return pan.q;
		});

		var cbkQstn = function cbkQstn(question) {
			return pansQuestionsIds.indexOf(question.id) === -1;
		};

		// [{q1}, {q3}]
		var openedQuestions = questions.filter(cbkQstn);

		// TODO: return using sorting by id or ttl
		return openedQuestions[0];
	};

	var xpo = function xpo() {
		return {
			toUrlParams: function toUrlParams(data) {
				return Object.keys(data).map(function (k) {
					return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
				}).join('&');
			},
			// from asdf-zxcv_qert-bzx to obj
			fromStrToAnsw: function fromStrToAnsw(str) {
				if (!str) {
					return [];
				}

				// faceform_oval-bodyform_normal
				return str.split('-').map(function (pair) {
					var qa = pair.split('_');
					return {
						q: qa[0],
						a: pair
						// qa[1]
					};
				});
			},
			fromAnswToStr: function fromAnswToStr(arr) {
				var pairs = arr.map(function (pan) {
					//return pan.q + '-' + pan.a;
					// faceform_oval
					return pan.a;
				});

				//console.log('pairs', pairs);
				return pairs.join('-');
			},
			calcNextQuestion: calcNextQuestion
		};
	};

	angular.module('myApp.quizHelper', []).factory('quizHelper', [xpo]);
})(window.angular);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
	'use strict';

	var Xpo = function Xpo($scope, $state, readiness, quizSrvc, quiz_ttl) {
		_classCallCheck(this, Xpo);

		var quizRelUrl = $state.href("byt.quizItem.qstnList");

		var cbkCatch = function cbkCatch(err) {
			console.log(err);
			var errmsg = '';
			if (err.status === 404) {
				errmsg = 'Тест не найден';
				readiness.notFound();
			} else {
				errmsg = 'Ошибка загрузки теста: повторите запрос позже';
				readiness.serverError(err);
			}

			$scope.quizErr = errmsg;
		};

		var cbkSuccess = function cbkSuccess(qz) {
			// // get it from hash: already answered
			// // or store it right in main directive (no hash or url)
			// qz.pans = [];
			//quizHelper.fromStrToAnsw(quiz_answers);
			qz.ttl = qz.ttl[0].charAt(0).toUpperCase() + qz.ttl.slice(1);
			qz.dscr = 'В результате теста - краткие рекомендации, как выбрать подходящую причёску или стрижку: что вам подойдёт, а чего следует избегать.';

			qz.rel_url = quizRelUrl;
			// стрижки подходящие 11к
			// подходящая прическа 11к

			$scope.quizItem = qz;
			// it is abstract view

			// move ok to quizItem directive
			// readiness.ok('Test ', 'wow');
		};

		quiz_ttl = quiz_ttl.replace(/-/g, ' ');

		quizSrvc.getItem(quiz_ttl).then(cbkSuccess).catch(cbkCatch);
	};

	angular.module('myApp.QuizItemController', ['myApp.quizSrvc', 'myApp.readiness']).controller('QuizItemController', ['$scope', '$state', 'readiness', 'quizSrvc', 'quiz_ttl',
	//	  'quiz_answers',
	Xpo]);
})(window.angular);

// quizSrvc.getSuites()
// 	.then((arr) => $scope.suites = arr);

// attach pass_answers (states) to a quiz
// console.log('qparams', q_params);

// parse answers to pans

// calculate qa
// find all possible questions from qz
// remove unneeded qparams
// find for every question - possible answers
// remove unneeded qparams
// send qparams as a UserPass to drct

// user_pass is not in suitable for this situation
// use pass_answers only withot binding to user_pass

// pans are depends of a quiz through qa
// but a quiz can exists without pans (states)

// but pans can not exists without a quiz
// attach to qz

// pass answers

// var quiz_answers = '';

//console.log('quizSrvc', quizSrvc);
'use strict';

// first - make sharing of text
// add title: pricheski for long faces and red hairs
// second - generate and add an image
// move to the server
// hide how to response generated
// show some delays between responses
// or load all answers at once
// web admin to edit tests
// use separated quiz_app, on nodejs or go
// use mongodb or similar db
// our admin panel allows to use some selectboxes, etc.
// no need to extract as svc everytime and update it manually
//   or using hard-configurable system to export it and insert to db

(function (angular, APPCONF) {
	'use strict';

	// для неполных наборов - какой результат выбирать,
	// если есть набор для faceform_oval
	// и отдельный набор для haircolor_red?
	// любой!

	var cacheQuiz = {};

	var cacheQres = {};

	var xpo = function xpo($q, $http) {
		//var apiqHost = 'https://localhost:2222/v1';
		//'https://apiq.miskra.ru/v1';

		return {
			getItem: function getItem(ttl) {
				if (cacheQuiz[ttl]) {
					return $q.when(cacheQuiz[ttl]);
				}

				return $http({
					method: "GET",
					url: APPCONF.QUIZ_ENDPOINT + '/quiz/get-full-by-title',
					// headers: {
					//   'Authorization': 'super key'
					// },
					params: {
						ttl: ttl
					}
					//cache: apimasCache
				}).then(function (r) {
					cacheQuiz[ttl] = r.data;
					return r.data;
				});
				//.then((r) => r.data);
				// send a request to apiq: apiq.miskra.ru

				// itemId
				// var qz = repoData.quizList.filter((quizItem) => quizItem.id === quizId)[0];
				// if (qz) {
				//   return $q.when(qz);
				// } else {
				//   return $q.reject(new Error('notFound'));
				// }
			},
			getQres: function getQres(id) {
				if (cacheQres[id]) {
					return $q.when(cacheQres[id]);
				}
				var qresEndpoint = APPCONF.QUIZ_ENDPOINT + '/qres/get-item';
				return $http({
					method: "GET",
					url: qresEndpoint,
					params: {
						id: id
					}
				}).then(function (r) {
					return r.data;
				}).then(function (dta) {
					cacheQres[id] = dta;
					return dta;
				});
			},
			calcQres: function calcQres(answerIds) {
				var qresEndpoint = APPCONF.QUIZ_ENDPOINT + '/qres/calc-item';
				return $http({
					method: "GET",
					url: qresEndpoint,
					params: {
						// haircolor_red-faceform_oval-...
						answers: answerIds.join('-')
					}
					//cache: apimasCache
				}).then(function (r) {
					return r.data;
				}).then(function (dta) {
					cacheQres[dta.id] = dta;
					return dta;
				});

				// todo: calc from qresEndpoint (not from helper)
				// var qres = quizHelper.calcResult(suites,
				// 								 answerIds);
				// if (!qres){
				//   return $q.reject(new Error('no qres'));
				// } else {
				//   return $q.when(qres);
				// }
			}
		};
	};

	angular.module('myApp.quizSrvc', []).factory('quizSrvc', ['$q', '$http', xpo]);
})(window.angular, window.APPCONF);
'use strict';

(function (angular) {
		'use strict';

		var xpo = function xpo($scope, q_id, q_tpe, q_hash, q_name) {
				//q_tpe = q_tpe || 'tbl';

				$scope.splr = {
						id: q_id,
						name: q_name
				};

				//console.log('splr-item-ctrl', q_id, q_tpe, q_hash);
		};

		angular.module('myApp.SplrItemController', []).controller('SplrItemController', ['$scope', 'q_id', 'q_tpe', 'q_hash', 'q_name',
		// injected from prev controller (like rubric_item)
		//'master_profile_id',
		xpo]);
})(window.angular);
'use strict';

(function (angular, APPCONF) {
	'use strict';

	var xpo = function xpo($scope, $state, $interval, lgr, readiness, sessRepo, oauthEntry, apimas) {
		// a user can redirect back, using back button
		//, q_redirect_url

		// $scope.rdr_url = q_redirect_url;

		$scope.page_ttl = 'Вход для мастеров и салонов красоты';

		var cbkSuccessUpdate = function cbkSuccessUpdate() {
			var sessData = sessRepo.getData();
			// uid must be not null (after log-in)
			$state.go('byt.splrItem.main', {
				supplier_id: sessData.uid
			});
		};

		var cbkCatchUpdate = function cbkCatchUpdate(reason) {
			lgr.crit('oauthUpdateSess', 'catch', {
				reason: reason
			});
		};

		var cbkSuccessAuth = function cbkSuccessAuth(r) {
			sessRepo.updateSess(r.auth_token).then(cbkSuccessUpdate).catch(cbkCatchUpdate);
		};

		var cbkCatchAuth = function cbkCatchAuth(r) {
			lgr.crit('oauthCatch', 'oauth login', r);
		};

		var cbkSuccessCode = function cbkSuccessCode(issuer_id, response_type, r) {

			var tkn = response_type === 'code' ? r.code : r.access_token;

			if (!tkn) {
				cbkCatchAuth('required: code or access_token');
				return;
			}

			apimas.sendOauth(tkn, response_type, APPCONF.OAUTH_CALLBACK, issuer_id).then(cbkSuccessAuth).catch(cbkCatchAuth);
		};

		var cbkCatchCode = function cbkCatchCode(r) {
			lgr.crit('oauthCatchCode', 'catch verification code', r);
		};

		$scope.openOauthNstg = function () {

			oauthEntry.loginNstg(APPCONF.OAUTH_NSTG_ID, 'code', APPCONF.OAUTH_CALLBACK, [])
			// oauthEntry.loginVkn(APPCONF.OAUTH_VKN_ID,
			// 					  'code',
			// 					  REDIRECT_URI,
			// 					  [])
			.then(angular.bind(null, cbkSuccessCode, 'nstg', 'code')).catch(cbkCatchCode);
		};

		$scope.openOauthVkn = function () {

			oauthEntry.loginVkn(APPCONF.OAUTH_VKN_ID, 'code', APPCONF.OAUTH_CALLBACK, []).then(angular.bind(null, cbkSuccessCode, 'vkn', 'code')).catch(cbkCatchCode);
		};

		readiness.ok($scope.page_ttl, 'Вход или регистрация для мастеров и салонов красоты с использованием аккаунта Инстаграм: автоматический экспорт работ и услуг, переход в личный кабинет', $state.href("byt.oauthLogin"));
	};

	angular.module('myApp.OauthLoginController', ['myApp.oauthEntry', 'myApp.apimas', 'myApp.sessRepo', 'myApp.readiness', 'myApp.appLoginEmail']).controller('OauthLoginController', ['$scope', '$state', '$interval', 'lgr', 'readiness', 'sessRepo', 'oauthEntry', 'apimas',
	// 'q_redirect_url',
	xpo]);
})(window.angular, window.APPCONF);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
  'use strict';

  var Xpo = function Xpo($scope, $state, lgr, readiness, apimas, statePrev, sessRepo) {
    _classCallCheck(this, Xpo);

    $scope.page_ttl = 'Вход';

    // TODO: is_stay flag: temporary short-live keys
    $scope.auth = {
      lgn: '', //'115670',
      pwd: '' //'123321'
    };

    $scope.statePrev = statePrev;

    var handle422 = function handle422(edata) {
      if (edata.errkey === "validationError") {
        var dtls = edata.details || {};
        if (dtls.property === "pwd" && dtls.msg === "is not correct") {
          return "неверный пароль";
        } else if (dtls.property === "lgn") {
          return "неверный логин";
        }

        return JSON.stringify(edata.details);
      }

      return JSON.stringify(edata);
    };

    var cbkFailAuth = function cbkFailAuth(e) {
      switch (e.status) {
        case 422:
          $scope.err_msg = handle422(e.data);
          return;
        case 401:
          $scope.err_msg = "Ошибка авторизации: неверные данные";
          return;
        default:
          $scope.err_msg = 'Непредвиденная ошибка';
          lgr.crit('errLoginAuth', 'fail auth pwd', e);
          return;
      }
    };

    var cbkSuccessUpdate = function cbkSuccessUpdate() {
      var sessData = sessRepo.getData();

      if (sessData.is_editor) {
        $state.go('byt.welcome');
      } else {
        // if is_supplier
        // uid must be not null (after log-in)
        $state.go('byt.splrItem.main', {
          supplier_id: sessData.uid
        });
      }
    };

    var cbkSuccessAuth = function cbkSuccessAuth(r) {
      sessRepo.updateSess(r.auth_token).then(cbkSuccessUpdate).catch(cbkFailAuth);

      // send a token to authFactory
      // add to a session storage (do not do it it this ctrl)
      // redirect masters to MasterPage: using id from auth_token
      // show an Edit button for authed masters (on a MasterPage)

      // use this token in apimas (for secured (POST) requests)
      // any POST request - assumes changing data
      // except Login, where auth=lgn+pwd
      // any GET request - may require auth too
    };

    var cbkFinally = function cbkFinally() {
      $scope.in_progress = false;
    };

    /**
     * Send auth data to the server to receive auth_token
     */
    $scope.sendAuth = function (lgn, pwd) {
      $scope.err_msg = '';
      $scope.in_progress = true;
      // check lgn and pwd, in html template
      apimas.sendLogin({
        lgn: lgn,
        pwd: pwd
      }).then(cbkSuccessAuth).catch(cbkFailAuth).finally(cbkFinally);
    };

    readiness.ok('Вход: логин и пароль', 'Вход или регистрация с последующим входом для мастеров и салонов красоты: форма входа по логину и паролю', $state.href("byt.splrLogin"));
  };

  angular.module('myApp.SplrLoginController', ['myApp.apimas', 'myApp.sessRepo', 'myApp.readiness', 'myApp.statePrev']).controller('SplrLoginController', ['$scope', '$state', 'lgr', 'readiness', 'apimas', 'statePrev', 'sessRepo', Xpo]);
})(window.angular);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
  'use strict';

  var Xpo = function Xpo($scope, readiness, apimas, sessRepo, q_id) {
    _classCallCheck(this, Xpo);

    $scope.sessData = sessRepo.getData();

    $scope.vpos = {
      val: 0
    };

    $scope.$watch('sessData.uid', function (newVal) {
      $scope.is_owner = q_id === newVal;
    });

    var cbkResult = function cbkResult(tmpSupplier) {
      if (!tmpSupplier.master_address) {
        // empty address object
        tmpSupplier.master_address = {
          master_profile_id: tmpSupplier.id
        };
      }

      $scope.supplier = tmpSupplier;

      readiness.ok('Редактирование мастера / салона красоты', 'Редактирование мастера или салона красоты: профиль, адрес, контактные данные, ссылки на другие источники');
    };

    var cbkCatch = function cbkCatch(response) {

      if (response.status === 404) {
        $scope.err_msg = 'Мастер не найден. Возможно он был удалён ранее модератором или самим мастером.';
        readiness.notFound();
      } else {
        $scope.err_msg = 'Возникла непредвиденная ошибка. Повторите запрос позже.';
        readiness.serverError(new Error(response.status));
      }
      // no need to close a dialog and open new
      // just write in current dialog
      // a user will close it after reading a error
    };

    apimas.sendGet('/master/get-profile', {
      id: q_id
    }, true).then(cbkResult).catch(cbkCatch);
  };

  angular.module('myApp.SplrManagerController', ['myApp.appScrollWatcher', 'myApp.splrPhoneEdt', 'myApp.splrEmailEdt', 'myApp.splrVkidEdt', 'myApp.apimas', 'myApp.sessRepo', 'myApp.readiness']).controller('SplrManagerController', ['$scope', 'readiness', 'apimas', 'sessRepo', 'q_id', Xpo]);
})(window.angular);
'use strict';

(function (angular) {
  'use strict';

  /* eslint quotes: 0 */

  var deps = ['myApp.SplrProfileEdtController', 'myApp.SplrServListEdtController', 'myApp.SplrServItemEdtController', 'myApp.SplrAggloEdtController', 'myApp.SplrSocialEdtController', 'myApp.SplrRemovalController', 'myApp.servCreatorEdt', 'myApp.workCreatorEdt', 'myApp.workItemEdt', 'myApp.workListEdt'];

  var xpo = function xpo() {

    var initRouter = function initRouter(appProvider) {

      var rootState = "byt.splrManager.";
      // config is executed once at app init
      //console.log(rootState);

      appProvider.state(rootState + 'profile', {
        url: '/profile',
        // or ?mode=update
        // manage - insert a new state of an object
        //   a new version of properties
        //   like /splrs/123/states/  - INSERT
        //   with removing previous version of states
        views: {
          managerContent: {
            templateUrl: "splr-manager/profile/profile-edt.tpl.html",
            controller: 'SplrProfileEdtController'
          }
        }
      }).state(rootState + "servList", {
        url: "/servs",
        views: {
          managerContent: {
            templateUrl: "splr-manager/serv-list/serv-list-edt.tpl.html",
            controller: 'SplrServListEdtController'
          }
        }
      }).state(rootState + "servCreator", {
        url: "/add-servs",
        views: {
          managerContent: {
            template: '<div serv-creator-edt data-supplier="supplier" ng-if="is_owner || sessData.is_moder"></div>'
          }
        }
      })

      // allows to link right from a masterViewPage
      .state(rootState + "servItem", {
        url: "/serv/:id",
        views: {
          managerContent: {
            templateUrl: "splr-manager/serv-item/serv-item-edt.tpl.html",
            controller: 'SplrServItemEdtController'
          }
        },
        resolve: {
          q_id: ['$stateParams', function ($stateParams) {
            return $stateParams.id;
          }]
        }
      }).state(rootState + "address", {
        url: "/address",
        views: {
          managerContent: {
            templateUrl: "splr-manager/address/agglo-edt.tpl.html",
            controller: 'SplrAggloEdtController'
          }
        }
      }).state(rootState + "social", {
        url: "/socials",
        views: {
          managerContent: {
            templateUrl: "splr-manager/social/social-edt.tpl.html",
            controller: 'SplrSocialEdtController'
          }
        }
      }).state(rootState + "removal", {
        url: "/removal",
        views: {
          managerContent: {
            templateUrl: "splr-manager/removal/removal.tpl.html",
            controller: 'SplrRemovalController'
          }
        }
      });

      //console.log('child router');
    };

    return {
      initRouter: initRouter
    };
  };

  angular.module('myApp.mngrRouter', deps).factory('mngrRouter', [xpo]);
})(window.angular);

// .state(rootState + "phone", {
//     url: "/phone",
//     views: {
//       'managerContent': {
//         templateUrl: "splr-manager/phone/phone-edt.tpl.html",
//         controller: 'SplrPhoneEdtController'
//       }
//     }
// })

// .state(rootState + "email", {
//     url: "/email",
//     views: {
//       'managerContent': {
//         templateUrl: "splr-manager/email/email-edt.tpl.html",
//         controller: 'SplrEmailEdtController'
//       }
//     }
// })
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
	'use strict';

	var Xpo = function Xpo($scope, $state, $log, $http, $timeout, readiness,
	//    accFactory,
	//    fireFactory,
	aggloItemRepo, locRepo
	//    permRepo
	) {
		_classCallCheck(this, Xpo);

		$scope.page_ttl = 'МисКра';

		/**
   * Permission data: stores is_perm_checked switcher
   */
		//$scope.perm_data = permRepo.getData();

		var redirectToAggloSpecs = function redirectToAggloSpecs(tmpAgglo) {
			$state.go('byt.aggloItem.specList', {
				agglo_local_name: tmpAgglo.local_name
			});
			// a new page has their own ready methods
			// for phantom - no redirect (no session storage)
		};

		// Loaded after all agglos is received
		/**
   * Calculate agglo from auto-coords
   *   and redirect to this agglo
   *   or show error, if an agglo is not supported
   */
		var autoCalcAgglo = function autoCalcAgglo(tmpCoords) {

			// Get current auto-coords
			//    Auto-coords can be changed independently of the method
			//    Like a moving car (watch coords)
			//    but update an agglo only by click
			// find a agglo name by coords
			aggloItemRepo.retrieveByCoords(tmpCoords.lng, tmpCoords.lat).then(function (tmpAgglo) {
				if (tmpAgglo) {
					// save only for supported agglomerations
					//permRepo.saveLocationPermission();
					redirectToAggloSpecs(tmpAgglo);
				} else {
					alert("Местоположение не поддерживается сервисом. Попробуйте выбрать вручную.");
				}
			});
		};

		// by click on a button: auto-define
		$scope.defineLocation = function () {
			locRepo.retrieveFromDevice().then(autoCalcAgglo).catch(function (reason) {
				// не удалось получить местоположение
				alert(reason);
			});
		};

		var failCalcAgglo = function failCalcAgglo() {
			$scope.err_calc = 'не удалось определить автоматически';
		};

		var calcAgglo = function calcAgglo(tmpCoords) {
			aggloItemRepo.retrieveByCoords(tmpCoords.lng, tmpCoords.lat).then(function (tmpAgglo) {
				if (!tmpAgglo) {
					failCalcAgglo();
				} else {
					$scope.agglo_calc = tmpAgglo;
				}
			}).catch(failCalcAgglo);
		};

		var tryToAutoDefine = function tryToAutoDefine() {
			locRepo.retrieveByIp().then(function (coords) {
				calcAgglo(coords);
			}).catch(failCalcAgglo);
		};

		var init = function init() {
			// values the same as in index files: gulpfile
			readiness.ok('Мастера и салоны красоты', 'Парикмахеры, визажисты, уход за ногтями, бровями и ресницами - мастера и салоны красоты России, а также Украины, Казахстана и Белоруссии');

			$scope.is_progress_auto = true;
			tryToAutoDefine();
		};

		init();
	};

	angular.module('myApp.WlcController', ['ui.router', 'myApp.aggloItemRepo', 'myApp.locRepo', 'myApp.readiness']).controller('WlcController', ['$scope', '$state', '$log', '$http', '$timeout', 'readiness', 'aggloItemRepo', 'locRepo', Xpo]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	//var parentEl = angular.element(document.body);

	var xpo = function xpo() {
		var ths = this;

		ths.offer_list = [
			//{
			//   id: 1234,
			//   rubric_names: ['Наращивание ресниц'],
			//   percent: 50,
			//   conditions: 'ежедневно до 12 часов дня',
			//   end_time: 1435611600, // 30 June
			//   master_address: {
			// 	description: 'м.1905г / м.Выставочная'
			//   },
			//   master_profile: {
			// 	id: 840427,
			// 	name: 'Ирина',
			// 	main_phone: '+79141541117',
			// 	nstg_username: 'milash_moskow'
			//   }
			// },{
			//   id: 1235,
			//   rubric_names: ['Маникюр','Педикюр', 'Шеллак', 'Укладка',
			//   				 'Шугаринг','Архитектура бровей',
			//   				 'Биотатуаж','Макияж'],
			//   percent: 25,
			//   conditions: 'ежедневно с 10 до 13 часов',
			//   end_time: 1435611600, // 30 June
			//   master_address: {
			// 	description: 'Старый Арбат 4/1'
			//   },
			//   master_profile: {
			// 	id: 863323,
			// 	name: 'MY RELIGION',
			// 	main_phone: '+79857494428',
			// 	nstg_username: 'myreligionmsc'
			//   }
			// }
		];
	};

	angular.module('myApp.OfferListController', []).controller('OfferListController', [xpo]);
})(window.angular);
'use strict';

(function (angular) {
		'use strict';

		// it is intermediate layer: redirect to /services?by=xxx

		var xpo = function xpo($scope, $q, $timeout, readiness, hprFactory, servGroupRepo, q_agglo_local_name, q_spec_name) {

				// Titles are limited to 512 total characters in internet explorer according to MSDN.
				// site+ city+ specItem
				// console.log('spec_item', q_spec_name, q_agglo_local_name);

				// already checked possible values in a resolve function

				// select between
				// ?by=master
				// ?by=salon

				//   /**
				//    * Current serv group (spec)
				//    * @type {Object}
				//    */

				//   // html here is not ready: if an address url contains
				//   //   this two links
				//   // if no links in an address url
				//   //   show two links:
				//   // /services?by=master
				//   // /salons
				// };

				// variant: load only one rubric (with statistic) by name
				servGroupRepo.retrieveData().then(function (arr) {
						// $scope.arr_serv_group = r.arr_serv_group;
						// load child views

						// this property is independent of rubric_arr
						// and may be retrieved using own request: /rubrics/:name
						var curSpec = hprFactory.findElemByProp(arr || [], 'name', q_spec_name);

						if (curSpec) {
								$scope.cur_spec = curSpec;
								// readiness -> in nested views
						} else {
										$scope.err_cur_spec = {
												msg: 'Специализация "' + q_spec_name + '" в городе ' + $scope.cur_agglo.local_name + ' не найдена'
										};

										readiness.notFound();
								}
				}).catch(function (reason) {
						$scope.err_cur_spec = {
								msg: 'Ошибка загрузки специализации. Пожалуйста, попробуйте позже',
								reason: reason
						};

						console.log('retrieveData', reason);
						readiness.serverError(new Error(reason));
				});

				// unselect a group - redirect back
				// show it with 500ms delay
				$timeout(function () {
						$scope.is_prg = true;
				}, 500);
		};

		angular.module('myApp.SpecItemController', ['myApp.hprFactory', 'myApp.servGroupRepo', 'myApp.readiness']).controller('SpecItemController', ['$scope', '$q', '$timeout', 'readiness', 'hprFactory', 'servGroupRepo', 'q_agglo_local_name', 'q_spec_name', xpo]);
})(window.angular);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
	'use strict';

	var Xpo = function Xpo($scope, $timeout, $state, readiness, servGroupRepo) {
		_classCallCheck(this, Xpo);

		// 	,q_agglo_local_name
		// $scope.agglo must be

		$scope.calcHref = function (specName) {
			return $state.href("byt.aggloItem.specItem.rubricList", {
				agglo_local_name: $scope.agglo.local_name,
				spec_name: specName
			});
		};

		// unselect a group, using this method
		// do not use direct nulling - it doesn't clean this id
		// unselect all serv_rubrics: from selected parrubric

		// Load rubrics after agglo is selected:
		//   manually or automatically   
		// Remove inherit parameters:
		// inject or define from url again
		// Load rubrics only after city selected
		// step by step
		// tmpAgglo.id,
		servGroupRepo.retrieveData().then(function (arr) {
			$scope.groups = arr;

			// ttl: '{agglo_local_name} - мастера и салоны красоты',
			// dscr: ''

			var canonicalPath = $state.href('byt.aggloItem.specList', {
				agglo_local_name: $scope.agglo.local_name
			});

			readiness.ok($scope.agglo.local_name + ' - услуги мастеров и салонов красоты', 'Перечень услуг красоты: парикмахеры, стилисты, визажисты, услуги по уходу за ногтями, ресницами, бровями и многое другое в ' + $scope.agglo.case_prepositional, canonicalPath);
		}).catch(function (reason) {
			$scope.err_groups = {
				msg: 'Ошибка загрузки категорий. Пожалуйста, попробуйте позже',
				reason: reason
			};

			console.log(reason);
			readiness.serverError(new Error(reason));
		});

		// show it with 500ms delay
		$timeout(function () {
			$scope.is_prg = true;
		}, 500);
	};

	var drct = function drct() {
		return {
			restrict: 'A',
			templateUrl: 'agglo-item/spec-list/spec-list.tpl.html',
			scope: {
				'agglo': '='
			},
			controller: ['$scope', '$timeout', '$state', 'readiness', 'servGroupRepo', Xpo]
		};
	};

	angular.module('myApp.specListDrct', ['myApp.leftLinkDrct', 'myApp.servGroupRepo', 'myApp.readiness']).directive('specListDrct', [drct]);
})(window.angular);
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// TODO: move all apimas endpoints to this factory
(function (angular, APPCONF) {
	'use strict';

	var objToForm = function objToForm(obj) {
		var str = [];
		for (var p in obj) {
			// skip null fields
			if (obj[p] !== null) {
				// skip all related, nested objects
				if (_typeof(obj[p]) !== 'object') {
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
			}
		}
		return str.join("&");
	};

	var xpo = function xpo($http, $q, sessRepo, apimasCache, Upload) {
		apimasCache.removeAll();

		var sendMultipart = function sendMultipart(endpoint, file) {
			// calculate authToken from localStorage
			var authToken = sessRepo.getData().token;

			if (!authToken) {
				return $q.reject('Требуется авторизация: войдите в личный кабинет.');
			}

			return Upload.upload({
				url: APPCONF.APIMAS_POST_ENDPOINT + endpoint,
				method: 'POST',
				data: {
					ufile: file
					// 'username': $scope.username
				},
				headers: {
					'Authorization': 'Bearer ' + authToken
				}
			});
		};

		var sendPost = function sendPost(endpoint, bodyParams) {

			// calculate authToken from localStorage
			var authToken = sessRepo.getData().token;

			if (!authToken) {
				return $q.reject('Требуется авторизация: войдите в личный кабинет.');
			}

			return $http({
				method: "POST",
				url: APPCONF.APIMAS_POST_ENDPOINT + endpoint,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'Authorization': 'Bearer ' + authToken
				},
				data: objToForm(bodyParams)
				// params: {
				//   token: 'super-key'
				// }
			}).then(function (r) {
				return r.data;
			}).catch(function (err) {
				if (err.status === 401) {
					// auth token is expired or smth else
					// remove auth
					sessRepo.deleteSess();
					// todo: realize after v2
					// expired token
					// eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NTEwMzYxNTgsInBlcm1zIjoyLCJ1aWQiOjN9.N4cu1tVg5EVJBPtic6mJis8u_z_wyeRwO4lT9oJxWGWGSFPw5xxkRcIaHGs8anLsem0p1iIVW_9a2u19UcabyLc69XTaQMdkF0mDFGF1Jxy2P1_-cN_DtAYrgzVroKy5xSnCqSHvmOBy_o78dkQECmN-TLAlCxeeWX0eTeq6Ur4
					//alert('Требуется авторизация: войдите в личный кабинет.');
				}
				//console.log('handle err', err);
				// hande other errors on a client
				return $q.reject(err);
			});
		};

		/**
   * POST method without AUTH header
      * Returns authtoken
   */
		var sendLogin = function sendLogin(bodyParams) {
			return $http({
				method: "POST",
				url: APPCONF.APIMAS_POST_ENDPOINT + '/sess/login',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				data: objToForm(bodyParams)
				// params: {
				//   token: 'super-key'
				// }
			}).then(function (r) {
				return r.data;
			});
		};

		var sendReportNoImage = function sendReportNoImage(bodyParams) {
			return $http({
				method: "POST",
				url: APPCONF.APIMAS_POST_ENDPOINT + '/work/report-no-image',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				data: objToForm(bodyParams)
			}).then(function (r) {
				return r.data;
			});
		};

		// sends a letter
		var sendRegFree = function sendRegFree(bodyParams) {
			return $http({
				method: "POST",
				url: APPCONF.APIMAS_POST_ENDPOINT + '/sess/reg-free',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				data: objToForm(bodyParams)
			}).then(function (r) {
				return r.data;
			});
		};

		/**
   * Send a log message to admin
   */
		var sendLog = function sendLog(msg) {
			var bodyParams = {
				link: msg
			};

			return $http({
				method: "POST",
				url: APPCONF.APIMAS_POST_ENDPOINT + '/sess/reg-free',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				data: objToForm(bodyParams)
			}).then(function (r) {
				return r.data;
			});
		};

		/**
   * Send oauth
   * @param {String} tkn - access_token or code, 
   *        retrieved from issuer by oauth flow
   * @param {String} response_type - token or code
   * @param {String} redirect_uri - Uri to redirect,
   *        the same, as used in oauth flow
   * @param {String} issuer_id - Like 'nstg', 'facebook', etc
   * @return promise
   *         http returns auth token (JWT format)
   */
		var sendOauth = function sendOauth(tkn, response_type, redirect_uri, issuer_id) {
			var bodyParams = {
				tkn: tkn,
				response_type: response_type,
				redirect_uri: redirect_uri,
				issuer_id: issuer_id
			};

			console.log(bodyParams);

			return $http({
				method: "POST",
				url: APPCONF.APIMAS_POST_ENDPOINT + '/sess/oauth',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					// 'Authorization': 'Bearer ' + authToken
				},
				data: objToForm(bodyParams)
				// params: {
				//   token: 'super-key'
				// }
			}).then(function (r) {
				return r.data;
			});

			// return $q.when({
			//   auth_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0Mzg2OTQ5OTAsInBlcm1zIjoxMTIsInVpZCI6MTE1NjcwfQ.PG1eJctEG4XAfiFPfEAp1oQun3bd_HSWozxeSuH02JHpS2G4olqbY3VcLuNHKMipkmJlVdRW6Xk8fe2a0X3Nxyi8lL3mjwOrTIOBSDQXZ2Q9enP0Dm2nu69na5k4TERqsa20KYYporAqhDU88Zu60HH-sHyw2Fg4YfGLARVciCc'
			// });
		};

		/**
   * Generates a verification code and send it to this email
   */
		var sendVcodeEmail = function sendVcodeEmail(tmpEmail) {
			// return $q.when({lgn: tmpEmail});
			// return $q.reject({
			//   status: 500,
			//   data: {
			//     errkey: 'duplicateKeyError',
			//     details: {
			//       property: "lgn_again",
			//       msg: 'some message for developer'
			//     }
			//   }
			// });
			var bodyParams = {
				lgn: tmpEmail,
				lgn_again: tmpEmail
			};

			return $http({
				method: 'POST',
				url: APPCONF.APIMAS_POST_ENDPOINT + '/sess/vcode-email',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				data: objToForm(bodyParams)
			}).then(function (r) {
				return r.data;
			});
		};

		/**
   * Verifies a login and email
   * Returns authtoken, like a /login method
   */
		var sendLoginEmail = function sendLoginEmail(tmpEmail, tmpVcode) {
			// return $q.reject({
			//   status: 422,
			//   data: {
			//     errkey: 'validationError',
			//     details: {
			//       code: "errMaxRetry",
			//       msg: 'some message for developer'
			//     }
			//   }
			// });

			// returns authToken
			// return $q.when({
			//   auth_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0Mzg2OTQ5OTAsInBlcm1zIjoxMTIsInVpZCI6MTE1NjcwfQ.PG1eJctEG4XAfiFPfEAp1oQun3bd_HSWozxeSuH02JHpS2G4olqbY3VcLuNHKMipkmJlVdRW6Xk8fe2a0X3Nxyi8lL3mjwOrTIOBSDQXZ2Q9enP0Dm2nu69na5k4TERqsa20KYYporAqhDU88Zu60HH-sHyw2Fg4YfGLARVciCc'
			// });

			var bodyParams = {
				lgn: tmpEmail,
				vcode: tmpVcode
			};

			return $http({
				method: 'POST',
				url: APPCONF.APIMAS_POST_ENDPOINT + '/sess/login-email',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				data: objToForm(bodyParams)
			}).then(function (r) {
				return r.data;
			});
		};

		/**
   * @param {bool?} isFresh
   */
		var sendGet = function sendGet(endpoint, urlParams, isFresh) {
			if (isFresh) {
				// version of a data (only fresh)
				urlParams.v = new Date().getTime();
			}

			return $http({
				method: "GET",
				url: APPCONF.APIMAS_ENDPOINT + endpoint,
				// headers: {		 
				//   'Authorization': 'super key'
				// },
				params: urlParams
				//cache: apimasCache
			}).then(function (r) {
				return r.data;
			});
		};

		return {
			/**
    * Post request, with Auth Header
    */
			sendPost: sendPost,
			/**
    * Post request with multipart/form-data
    */
			sendMultipart: sendMultipart,
			/**
    * Get request without auth
    */
			sendGet: sendGet,
			/**
    * Send a log message and other data
    */
			sendLog: sendLog,
			/**
    * Login method, lgn + pwd instead auth header
    */
			sendLogin: sendLogin,
			/**
    * Send reg-free form
    */
			sendRegFree: sendRegFree,
			/**
    * Login by OAuth token or code
    */
			sendOauth: sendOauth,
			/** Generate a verification code for an email */
			sendVcodeEmail: sendVcodeEmail,
			//sendVcodePhone
			sendLoginEmail: sendLoginEmail,
			//sendLoginPhone
			/**
    * Send a report with unavailable image work
    */
			sendReportNoImage: sendReportNoImage
		};
	};

	angular.module('myApp.apimas', ['myApp.sessRepo', 'ngFileUpload']).factory('apimasCache', ['$cacheFactory', function ($cacheFactory) {
		return $cacheFactory('apimas-cache');
	}]).factory('apimas', ['$http', '$q', 'sessRepo', 'apimasCache', 'Upload', xpo]);
})(window.angular, window.APPCONF);
'use strict';

(function (angular, APPCONF) {
  'use strict';

  var xpo = function xpo($http, $q) {

    var gis_params = {
      key: APPCONF.APICOM_KEY,
      version: APPCONF.APICOM_VERSION,
      'stat[user]': APPCONF.XUID,
      'stat[sid]': APPCONF.XSID
      // id
      // hash
    };

    var cbkReq = function cbkReq(data) {

      // handle in catch
      // if (r.status !== 200) {
      //   return $q.reject('Ошибка запроса');
      // }

      // if (!r.data) {
      //   return $q.reject('Ошибка запроса');
      // }

      //var dfr = $q.defer();
      //http://api.2gis.ru/doc/firms/response-codes#responses
      if (data.response_code === '404') {
        return $q.reject({
          status: 404
        });
        // dfr.resolve(null);
        // return;
        // //return null;
      }

      if (data.response_code !== '200') {
        return $q.reject({
          status: 500
        });
        //$q.reject('Ошибка при получении информации о салоне');
      }

      // if success - register a view
      // at this moment only for an index.html page
      if (window.DG) {
        window.DG.apitracker.regBC(data.register_bc_url);
      }

      return data;
    };

    //http://api.2gis.ru/doc/firms/profiles/profile/
    var loadFirm = function loadFirm(id, hash) {
      gis_params['id'] = id;
      gis_params['hash'] = hash;

      // URL:http://catalog.api.2gis.ru/2.0/catalog/branch/get?id=70000001017182335_785r64G6G5IH4H0J3HH1vb42fjn4B67A6I3548382uvhy7062B577G788BA185tk959G44GI0G635924HJec&see_also_size=4&fields=items.adm_div%2Citems.region_id%2Citems.reviews%2Citems.point%2Citems.links%2Citems.name_ex%2Citems.org%2Citems.see_also%2Citems.dates%2Citems.external_content%2Citems.flags%2Citems.ads.options%2Citems.email_for_sending.allowed%2Chash%2Csearch_attributes&key=ruewin2963

      return $http({
        method: 'GET',
        url: APPCONF.APICOM_ENDPOINT + '/profile',
        params: gis_params
      }).then(function (r) {
        return r.data;
      }).then(cbkReq);
    };

    return {
      loadFirm: loadFirm
    };
  };

  angular.module('myApp.firmItemFactory', []).factory('firmItemFactory', ['$http', '$q', xpo]);
})(window.angular, window.APPCONF);
'use strict';

/**
 * http://api.2gis.ru/doc/firms/searches/search
 * bound[point1]=37.432,55.836&bound[point2]=37.633,55.637
 * в системе координат WGS84.
 * bound: {p1: 123, p2: 2334} translates to (using $http)
 * "URL:http://ya.ru/?bound={"point1":"123","point2":"234"}&some=val"
 * http://catalog.api.2gis.ru/search?key=rucgsg0683&version=1.3&what=%D0%9F%D0%B0%D1%80%D0%B8%D0%BA%D0%BC%D0%B0%D1%85%D0%B5%D1%80&bound%5Bpoint1%5D=37.432,55.836&bound%5Bpoint2%5D=37.633,55.637
 */

(function (angular, APPCONF) {
  'use strict';

  var xpo = function xpo($http, $q) {

    var gis_params = {
      key: APPCONF.APICOM_KEY,
      version: APPCONF.APICOM_VERSION,
      sort: 'distance',
      page: 1,
      // Количество результатов поиска, выводимых на одной странице
      // Значение по умолчанию: 20. Ограничение: от 5 до 50.
      // http://api.2gis.ru/doc/firms/searches/search/
      // Usually a page contains nearest 50's objects
      // Do not load companies, if zoom < 14 - nothing to show
      pagesize: 50,
      what: '',
      'stat[user]': APPCONF.XUID,
      'stat[sid]': APPCONF.XSID
    };

    var cbkReq = function cbkReq(r) {
      if (r.status !== 200) {
        return $q.reject('Ошибка запроса');
      }

      if (!r.data) {
        return $q.reject('Ошибка запроса');
      }

      //http://api.2gis.ru/doc/firms/response-codes#responses
      if (r.data.response_code === '404') {
        return {
          total: 0,
          markers: []
        };
      }

      if (r.data.response_code !== '200') {
        return $q.reject('Ошибка запроса');
      }

      return {
        total: parseInt(r.data.total, 10),
        result: r.data.result
      };
    };

    // radius by default = 250 meters, max: 40km, min: 1m
    var loadFirmsByPoint = function loadFirmsByPoint(rubricName, lon1, lat1, radius) {

      gis_params['what'] = rubricName;
      gis_params['point'] = lon1.toString() + ',' + lat1.toString();
      gis_params['radius'] = radius;

      return $http({
        method: 'GET',
        url: APPCONF.APICOM_ENDPOINT + '/search',
        params: gis_params
      }).then(cbkReq);
    };

    return {
      // loadFirmsByBound: loadFirmsByBound,
      loadFirmsByPoint: loadFirmsByPoint
    };
  };

  angular.module('myApp.firmListFactory', []).factory('firmListFactory', ['$http', '$q', xpo]);
})(window.angular, window.APPCONF);

// /**
// * Convert GIS item to GeoJSON
// */
// var itemToMarker = function(item) {
//   return {
//     lat: parseFloat(item.lat),
//     lng: parseFloat(item.lon),
//     message: '<div style="background: yellow">' + item.name + '</div>'
//     // message: item.name,
//     // click: function() {
//     //   alert('asdf');
//     // }
//   };
// };

// e.g.: bound coords: 37.432, 55.836, 37.633, 55.637
// var loadFirmsByBound = function(rubricName, lon1, lat1, lon2, lat2) {
//   gis_params['bound[point1]'] = lon1.toString() + ',' + lat1.toString();
//   gis_params['bound[point2]'] = lon2.toString() + ',' + lat2.toString();
//   gis_params['what'] = rubricName;
'use strict';

/**
 * By default, getCurrentPosition() tries to answer as fast as possible 
 * with a low accuracy result. It is useful if you need a quick answer 
 * regardless of the accuracy. Devices with a GPS, for example, 
 * can take a minute or more to get a GPS fix, 
 * so less accurate data (IP location or wifi) 
 * may be returned to getCurrentPosition().
 */

(function (angular, APPCONF) {
	'use strict';

	var xpo = function xpo($q, $http, $timeout) {

		var getByIp = function getByIp() {

			var url = APPCONF.GEO_ENDPOINT;

			// for dev, desktop and mobile apps
			if (!url) {
				//dfr.reject('no');
				//var dfr = $q.defer();
				return $timeout(function () {
					// todo: dev
					return {
						latitude: 55.75,
						longitude: 37.6,
						accuracy: 100000
					};
				}, 500);
			} else {
				return $http({
					method: 'GET',
					url: url
				}).then(function (r) {
					// status, config
					//alert(JSON.stringify(ipCoords));

					if (!r.data) {
						return $q.reject(new Error('no data'));
					}

					var dta = r.data.Data;

					if (!dta) {
						return $q.reject(new Error('no Data'));
					}

					var lctn = dta.Location;

					if (!lctn) {
						return $q.reject(new Error('no Location'));
					}

					return {
						latitude: lctn.Latitude,
						longitude: lctn.Longitude,
						// city: ipCoords.city, usually it is undefined
						accuracy: 100000 // 100km
					};
				});
			}
		};

		var getCurCoords = function getCurCoords() {
			var dfr = $q.defer();
			// at this moment only ip
			// tryToIp(dfr);
			// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
			if ("geolocation" in navigator) {
				navigator.geolocation.getCurrentPosition(function (position) {
					dfr.resolve(position.coords);
				}, function (err) {
					//tryToIp(dfr);
					console.log('geoloc error', err);
					dfr.reject('Не удалось получить текущее местоположение');
				}, {
					timeout: 10000 // 2sec - too many for mobile devices in some cases
				});
			} else {
					// tryToIp(dfr);
					// $log.log('geoloc error', 'geolocation is not found in navigator');
					dfr.reject('Не удалось получить текущее местоположение');
				}

			// TODO: //lfl.GeoIP.centerMapOnPosition(map, 15);
			return dfr.promise;
		};

		return {
			getCurCoords: getCurCoords,
			getByIp: getByIp
		};
	};

	angular.module('myApp.geolocFactory', []).factory('geolocFactory', ['$q', '$http', '$timeout', xpo]);
})(window.angular, window.APPCONF);

// var p = {
//   "ip": "",
//   "country_code": "RU",
//   "country_name": "Russia",
//   "region_code": "",
//   "region_name": "",
//   "city": "",
//   "zip_code": "",
//   "time_zone": "Europe/Moscow",
//   "latitude": 123,
//   "longitude": 123.234,
//   "metro_code": 0
// };
'use strict';

(function (angular) {
  'use strict';
  /*eslint no-console: "off"*/

  var lvl = {
    debug: 'debug',
    info: 'info',
    warn: 'warn',
    crit: 'crit'
  };

  var IS_DEBUG = false;
  try {
    IS_DEBUG = document.location.hostname === 'localhost';
  } catch (e) {
    console.log(e);
  }

  var xpo = function xpo(apimas, hprFactory) {

    /** 
     * debug: log for non-production
     * info: log for production
     * warn: log, send to email with 'warn'
     * crit: log, send to email with 'crit'
     */
    var send = function send(level, id, msg, args, stack) {
      if (!level) {
        console.log('no level');
        return;
      }

      if (!IS_DEBUG && level === lvl.debug) {
        console.log('skip');
        return;
      }

      console.log(level, id, msg);

      if (args) {
        console.log(args);
      }

      if (stack) {
        console.log(stack);
      }

      if (level === lvl.crit || level === lvl.warn) {
        // todo: collect some browser info
        var full = {
          level: level,
          id: id,
          msg: msg,
          args: args,
          stack: stack,
          location: window.location.href
        };

        var browserInfo = hprFactory.browserInfo();

        if (!IS_DEBUG) {
          apimas.sendLog(JSON.stringify(full) + '\n' + JSON.stringify(browserInfo));
        } else {
          console.log('sendLog', full, browserInfo);
        }
      }

      // id - unique msg id per a project
      // msg - error or log message   
      // args - arguments of current function or any properties
      // stack - error.stack if exists

      // no function name and arguments names:
      //   they changed during minification
      // find a log message by id
    };

    // nginx levels: debug, info, notice, warn, error, crit, alert, emerg
    return {
      debug: function debug(id, msg, args, stack) {
        return send(lvl.debug, id, msg, args, stack);
      },
      info: function info(id, msg, args, stack) {
        return send(lvl.info, id, msg, args, stack);
      },
      warn: function warn(id, msg, args, stack) {
        return send(lvl.warn, id, msg, args, stack);
      },
      crit: function crit(id, msg, args, stack) {
        return send(lvl.crit, id, msg, args, stack);
      }
    };
  };

  angular.module('myApp.lgr', ['myApp.apimas', 'myApp.hprFactory']).factory('lgr', ['apimas', 'hprFactory', xpo]);
})(window.angular);
'use strict';

/**
 * Saves, retrieves and removes data from localstorage as tables
 */
(function (angular) {
  'use strict';

  function xpo($log, $q, localStorageService) {

    /**
     * Check an item: when all params matches - then true
     * @param {Object} params - { key1: val1, key2: val2}
     *         if params = {} - then true
     * @param {Object} item - item in array
     */
    function checkReadItem(params, item) {
      var isPassed = true;
      angular.forEach(params, function (paramValue, paramKey) {
        if (item[paramKey] !== paramValue) {
          // an every param must match
          isPassed = false;
        }
      });
      return isPassed;
    }

    /**
     * Get an item from storage:
     *     - Get an array from storage (from endpoint table)
     *     - Convert to real array from String
     *     - Find items by params (filter)
     *     - Return it as an array (if isArray) or item
     *       - If isArray=false must be zero or one item only (in other cases - error)
     */
    function readFromStorage(tblName, params, isArray) {
      var deferred = $q.defer();

      var tbl = localStorageService.get(tblName);
      if (!tbl) {
        //$log.log('tbl not found', tbl, tblName);
        deferred.resolve(isArray ? [] : null);
      } else {
        var arr = angular.fromJson(tbl);
        //$log.log(arr);
        var needItems = arr.filter(angular.bind(null, checkReadItem, params));

        if (isArray) {
          deferred.resolve(needItems);
        } else {
          if (needItems.length > 1) {
            deferred.reject('notOnlyOne');
          } else {
            // undefined or fullfiled item
            deferred.resolve(needItems[0]);
          }
        }
      }

      return deferred.promise;
    }

    /**
     * Write (update or insert): steps:
     *    get a table by endpoint, like 'pants'
     *    get all items, like [{}, {}] as a String
     *    convert to JSON array
     *    push the new item (obj)
     *    convert to String
     *    write to storage
     */
    function writeToStorage(tableName, obj) {
      var dfr = $q.defer();
      var tbl = localStorageService.get(tableName);

      var arr = tbl ? angular.fromJson(tbl) : [];

      var cur = arr.filter(function (item, ind) {
        if (item.id === obj.id) {
          arr[ind] = obj;
          return true;
        }
        return false;
      })[0];

      if (!cur) {
        arr.push(obj);
      }

      localStorageService.set(tableName, angular.toJson(arr));

      // Return created (updated) object
      dfr.resolve(obj);

      return dfr.promise;
    }

    /**
     * Del from a storage:
     *     - Find a table by endpoint
     *     - Convert to JSON
     *     - Find an object in a table and delete
     * @param {String} tblName
     * @param {Object} obj - Object to delete
     *                 if {} empty - remove all objects
     */
    function delFromStorage(tblName, obj) {
      var dfr = $q.defer();
      var tbl = localStorageService.get(tblName);
      if (tbl) {

        var arr = angular.fromJson(tbl);

        // delete all matched items (usually it's only one - unique constraint)
        angular.forEach(arr, function (item, ind) {
          if (checkReadItem(obj, item)) {
            arr.splice(ind, 1);
          }
        });

        localStorageService.set(tblName, angular.fromJson(arr));
      }
      dfr.resolve();
      return dfr.promise;
    }

    return {
      writeToStorage: writeToStorage,
      readFromStorage: readFromStorage,
      delFromStorage: delFromStorage
    };
  }

  angular.module('myApp.localDb', ['LocalStorageModule']).factory('localDb', ['$log', '$q', 'localStorageService', xpo]);
})(window.angular);
'use strict';

(function (angular, APPCONF, undefined) {
	'use strict';

	var split_tokens = {
		'code': '?',
		'token': '#'
	};

	var isInAppBrowserInstalled = function isInAppBrowserInstalled(cordovaMetadata) {
		var inAppBrowserNames = ["cordova-plugin-inappbrowser", "org.apache.cordova.inappbrowser"];

		return inAppBrowserNames.some(function (name) {
			return cordovaMetadata.hasOwnProperty(name);
		});
	};

	var parseResponseParameters = function parseResponseParameters(response) {
		if (response.split) {
			var parameters = response.split("&");
			var parameterMap = {};
			for (var i = 0; i < parameters.length; i++) {
				parameterMap[parameters[i].split("=")[0]] = parameters[i].split("=")[1];
			}
			return parameterMap;
		} else {
			return {};
		}
	};

	var handleAuthResponse = function handleAuthResponse(dfr, response_uri, response_type) {

		var callbackResponse = response_uri.split(split_tokens[response_type])[1];
		var parameterMap = parseResponseParameters(callbackResponse);
		if (parameterMap.access_token !== undefined && parameterMap.access_token !== null) {
			dfr.resolve({
				access_token: parameterMap.access_token
			});
		} else if (parameterMap.code !== undefined && parameterMap.code !== null) {
			dfr.resolve({
				code: parameterMap.code
			});
		} else {
			dfr.reject("Problem authenticating");
		}
	};

	var loginBrowser = function loginBrowser($q, win_uri, redirect_uri, response_type) {
		var dfr = $q.defer();
		// dfr.reject("Cannot authenticate via a web browser");

		var wnd = window.open(win_uri, 'windowName', 'location=0,status=0,width=800,height=400');

		var cbkTimeout = function cbkTimeout() {
			console.log(wnd);

			try {
				if (wnd.document) {
					var cur_uri = wnd.document.URL;

					if (cur_uri.indexOf(redirect_uri) >= 0) {
						console.log(cur_uri);
						window.clearInterval(ntrv);
						wnd.close();
						handleAuthResponse(dfr, cur_uri, response_type);
					}
				}
			} catch (exc) {
				console.log('myexc', exc);
			}

			if (wnd.closed) {
				window.clearInterval(ntrv);
				dfr.reject('Auth is cancelled');
			}
		};

		var ntrv = window.setInterval(cbkTimeout, 1500);

		return dfr.promise;
	};

	var loginCordova = function loginCordova($q, win_uri, redirect_uri, response_type) {

		var deferred = $q.defer();

		var cordovaMetadata = window.cordova.require("cordova/plugin_list").metadata;

		if (isInAppBrowserInstalled(cordovaMetadata) !== true) {
			deferred.reject("Could not find InAppBrowser plugin");
			return deferred.promise;
		}

		var browserRef = window.open(win_uri, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');

		var onLoadStart = function onLoadStart(event) {
			if (event.url.indexOf(redirect_uri) === 0) {
				browserRef.removeEventListener("exit", function () {});
				// function(event)
				browserRef.close();

				handleAuthResponse(deferred, event.url, response_type);
			}
		};

		browserRef.addEventListener('loadstart', onLoadStart);

		browserRef.addEventListener('exit', function () {
			// event
			deferred.reject("The sign in flow was canceled");
		});

		return deferred.promise;
	};

	var xpo = function xpo($q) {
		return {
			loginVkn: function loginVkn(client_id, response_type, redirect_uri, app_scope) {

				var win_uri = APPCONF.OAUTH_VKN_URI + '?client_id=' + client_id +
				// http://oauth.vk.com/blank.html
				'&redirect_uri=' + redirect_uri +
				// token
				'&response_type=' + response_type + '&display=touch';

				if (app_scope && app_scope.length > 0) {
					win_uri += '&scope=' + app_scope.join(",");
				}

				// /callback?error=access_denied&error_reason=user_denied&error_description=User%20denied%20your%20request
				// /callback?code=1231231

				if (window.cordova) {
					return loginCordova($q, win_uri, redirect_uri, response_type);
				} else {
					return loginBrowser($q, win_uri, redirect_uri, response_type);
				}
			},
			/*
       * Sign into the Instagram service
       *
       * @param    string clientId
       * @param    array appScope
       * @param    object options
       * @return   promise
    */
			loginNstg: function loginNstg(client_id, response_type, redirect_uri, app_scope) {

				// redirect_uri = "http://localhost/callback"; for mobile

				var win_uri = APPCONF.OAUTH_NSTG_URI + '?client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&response_type=' + response_type;

				if (app_scope && app_scope.length > 0) {
					win_uri += '&scope=' + app_scope.join(" ");
				}

				if (window.cordova) {
					return loginCordova($q, win_uri, redirect_uri, response_type);
				} else {
					return loginBrowser($q, win_uri, redirect_uri, response_type);
				}
			}
		};
	};

	angular.module('myApp.oauthEntry', []).factory('oauthEntry', ['$q', xpo]);
})(window.angular, window.APPCONF, undefined);
'use strict';

(function (angular, APPCONF) {
  'use strict';

  var xpo = function xpo(lgr) {

    var setHead = function setHead(ttl, dscr) {

      window.document.title = ttl;

      // if no description - set empty or remove it -
      //    to erase state from a previous page

      // <meta name="description" content="{{siteDescription}}"/>
      var mta = window.document.querySelector('meta[name=description]');
      if (mta) {
        mta.content = dscr || '';
      }
    };

    // var setOpenGraph = function(propName, contentValue){
    //     var mta = window.document.querySelector(`meta[property='og:${propName}']`);

    //     if (mta){
    //       mta.content = contentValue;
    //     } else {
    //     // replace or insert
    //       var elem = document.createElement('meta');
    //       elem.setAttribute('property', 'og:' + propName);
    //       elem.content = contentValue;
    //       window.document.getElementsByTagName('head')[0].appendChild(elem);
    //     }
    // };

    var setCanonicalLink = function setCanonicalLink(lnk) {
      var mta = window.document.querySelector('link[rel=canonical]');

      if (mta) {
        mta.href = lnk;
      } else {
        var link = document.createElement('link');
        link.rel = 'canonical';
        link.href = lnk;
        window.document.getElementsByTagName('head')[0].appendChild(link);
      }
    };

    var removeCanonicalLink = function removeCanonicalLink() {
      var mta = window.document.querySelector('link[rel=canonical]');
      if (mta) {
        mta.parentNode.removeChild(mta);
      }
    };

    var cyr = /[а-яё]/ig;

    // pth = /some-url/cyrillic/asdf?name=supernameencoded
    var encodePath = function encodePath(pth) {
      var arr = pth.split('/');
      arr = arr.map(function (item) {
        if (cyr.test(item)) {
          item = encodeURIComponent(item);
        }

        return item;
      });
      return arr.join('/');
    };

    var finishRender = function finishRender(statusCode) {
      // fired after $digest:
      //   when all watches will be calculated
      //   and DOM builded
      window.setTimeout(function () {
        // fire after DOM rendering
        if (typeof window.callPhantom === 'function') {
          window.callPhantom({
            appResult: 'clientFinished',
            statusCode: statusCode
          });

          lgr.debug('callPhantomFromClient');
        }

        lgr.info('runHtmlReady', 'finish render', {
          statusCode: statusCode
        });
      }, 0);
    };

    var handleOk = function handleOk(pageTitle, pageDescription, canonicalPath) {
      // default values the same as in index files gulpfile.js: process-html
      if (!pageTitle || !pageDescription) {
        lgr.crit('noTtlAndDscr', 'no ttl and dscr', arguments);
      }

      if (canonicalPath) {
        // encode a path: cyrillic to latin
        canonicalPath = encodePath(canonicalPath);
        setCanonicalLink(APPCONF.MAIN_HOST + canonicalPath);
      } else {
        removeCanonicalLink();
      }

      setHead(pageTitle + ' - МисКра', pageDescription + ' - МисКра');

      // setOpenGraph('title', pageTitle);
      // setOpenGraph('type', 'website');
      // setOpenGraph('url', '');

      // setOpenGraph('description', pageDescription);
      // setOpenGraph('locale', 'ru_RU');
      // setOpenGraph('site_name', 'МисКра');

      finishRender(200);
    };

    var handleNotFound = function handleNotFound() {
      setHead('404', '');
      removeCanonicalLink();
      finishRender(404);
    };

    var handleServerError = function handleServerError(err) {
      err = err || {};
      setHead('500', '');
      removeCanonicalLink();
      finishRender(500);

      lgr.crit('serverError', 'http 500', {
        message: JSON.stringify(err.message), // obj or string
        err: JSON.stringify(err) // if err - is a string
      }, err.stack);
    };

    // https://ru.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D0%BA%D0%BE%D0%B4%D0%BE%D0%B2_%D1%81%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D1%8F_HTTP
    return {
      // 2xx
      ok: handleOk,
      // 3xx
      // moved
      // 404
      notFound: handleNotFound,
      // 401
      //unauthorized:
      // 5xx
      serverError: handleServerError
    };
  };

  // change title and description
  // - use loaded data, like:
  //   - 100 records found
  //   - masterName of a work, loaded by an async request 
  angular.module('myApp.readiness', []).factory('readiness', ['lgr', xpo]);
})(window.angular, window.APPCONF);

// if (window.callPhantom){
//   window.callPhantom({"appResult": "tmpFinished"});
// }

// Executes the expression on the current scope at a later point in time.
// https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$evalAsync
// $rootScope.$evalAsync(function(){
//   handleOk('', '');
// });
'use strict';

(function (angular) {
  'use strict';

  /**
   * From WKT string to arr of coords
   *      use right order of polygon
   * @param {String} wktString - POLYGON((...))
   * @returns {Array}
   * [{latitude: 51.50, longitude: 7.40},
   * {latitude: 51.555, longitude: 7.40},
   * {latitude: 51.555, longitude: 7.625},
   * {latitude: 51.5125, longitude: 7.625} ]
   */

  var convertWktToArr = function convertWktToArr(wkt) {
    // skip POLYGON((..))
    wkt = wkt.substr(9, wkt.length - 11);
    var arrWkt = wkt.split(',');
    return arrWkt.map(function (item) {
      return {
        lng: parseFloat(item.split(' ')[0]),
        lat: parseFloat(item.split(' ')[1])
      };
    });
  };

  var getRegionsByCity = function getRegionsByCity(arrGeoRegion, cityId) {

    var needCity = arrGeoRegion.filter(function (item) {
      return item.city === cityId;
    })[0];

    if (!needCity) {
      return [];
    }

    var stations = needCity.stations;
    if (stations && stations.length > 0) {
      return stations.map(function (stn) {
        return {
          id: stn[0],
          name: stn[1]
        };
      });
    }

    var districts = needCity.districts;

    if (districts && districts.length > 0) {
      return districts.map(function (stn) {
        return {
          id: stn[0],
          name: stn[1]
        };
      });
    }

    return [];
  };

  var xpo = function xpo() {

    // https://github.com/manuelbieh/Geolib/blob/master/src/geolib.js
    /**
        * Checks whether a point is inside of a polygon or not.
        * Note that the polygon coords must be in correct order!
        *
        * @param        object      coordinate to check e.g. {latitude: 51.5023, longitude: 7.3815}
        * @param        array       array with coords e.g. [{latitude: 51.5143, longitude: 7.4138}, {latitude: 123, longitude: 123}, ...]
        * @return       bool        true if the coordinate is inside the given polygon
     */
    var isPointInside = function isPointInside(pnt, coords) {
      var c = false;

      //for(var i = -1, l = coords.length, j = l - 1; ++i < l; j = i) {
      for (var i = 0, l = coords.length, j = l - 1; i < l; i += 1) {
        if ((coords[i].lng <= pnt.lng && pnt.lng < coords[j].lng || coords[j].lng <= pnt.lng && pnt.lng < coords[i].lng) && pnt.lat < (coords[j].lat - coords[i].lat) * (pnt.lng - coords[i].lng) / (coords[j].lng - coords[i].lng) + coords[i].lat) {
          c = !c;
        }

        j = i;
      }

      return c;
    };

    /**
     * Whether the coords in some polygon (in WKT format string)
     * @param {Stirng} wkt - string
     *        POLYGON((76.725995552456567 43.469106272843845,77.108400310397244
     *        43.462692429549705,77.096182318096027 43.108051229816695,
     *        76.715990607945855 43.114386539985126,
     *        76.725995552456567 43.469106272843845))
     */
    var isPointInsideWkt = function isPointInsideWkt(wkt, lat, lng) {
      return isPointInside({
        lng: lng,
        lat: lat
      }, convertWktToArr(wkt));
    };

    var findAggloByCoords = function findAggloByCoords(arrAgglo, latitude, longitude) {
      // if (!aggloCode) {
      //   return null;
      // }
      // aggloCode = aggloCode.toLowerCase();
      var result;

      // item.actual_extent = wkt coordinates polygone
      angular.forEach(arrAgglo, function (item) {
        // http://stackoverflow.com/questions/13843972/angular-js-break-foreach
        if (!result) {
          if (isPointInsideWkt(item.extent, latitude, longitude)) {
            result = item;
            // if (val.code === aggloCode) {
            //   result = val;
            // }
          }
        }
      });

      return result;
    };

    return {
      isPointInsideWkt: isPointInsideWkt,
      findAggloByCoords: findAggloByCoords,
      getRegionsByCity: getRegionsByCity
    };
  };

  angular.module('myApp.geoHelper', []).factory('geoHelper', [xpo]);
})(window.angular);
'use strict';

(function (angular) {
  'use strict';

  var xpo = function xpo() {
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
    var isArrInArr = function isArrInArr(a1, a2) {
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
    var findElemByProp = function findElemByProp(arr, propName, propVal) {

      // propVal maybe a string or integer or any other type
      // match with registry ignorance
      // if (typeof propVal === 'string'){
      // 	propVal = propVal.toLowerCase();
      // }

      var elementPos = arr.map(function (x) {
        var elemVal = x[propName];

        // if (typeof elemVal === 'string'){
        //   elemVal = elemVal.toLowerCase();
        // }

        return elemVal;
      }).indexOf(propVal);

      //console.log('febp', propName, propVal, elementPos);
      // arr[-1]  undefined;
      if (elementPos === -1) {
        return null;
      }

      return arr[elementPos];
    };

    var isElemInViewport = function isElemInViewport(el, phase) {
      phase = phase || 0;
      var rect = el.getBoundingClientRect();

      return rect.top >= 0 - phase && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + phase && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
      ;
    };

    /**
     * WKT POINT(123123.12 442353.3463) 
     *   to {longitude:123, latitude: 442}
     */
    var coordsFromWktPoint = function coordsFromWktPoint(wktPoint) {
      wktPoint = wktPoint.substr(6, wktPoint.length - 7);
      var tmpArr = wktPoint.split(' ');
      //console.log(tmpArr);
      return {
        lng: parseFloat(tmpArr[0]),
        lat: parseFloat(tmpArr[1])
      };
    };

    var shuffle = function shuffle(array) {
      var counter = array.length,
          temp,
          index;
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

    var toHashCode = function toHashCode(str) {
      str = str + '';
      var hash = 0,
          i,
          chr,
          len;
      if (str.length === 0) {
        return hash;
      }
      for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };

    /** Browser info */
    var browserInfo = function browserInfo() {
      //var nVer = navigator.appVersion;
      var nAgt = navigator.userAgent;
      var browserName = navigator.appName;
      var fullVersion = '' + parseFloat(navigator.appVersion);
      var majorVersion = parseInt(navigator.appVersion, 10);
      var nameOffset, verOffset, ix;

      // In Opera, the true version is after "Opera" or after "Version"
      if ((verOffset = nAgt.indexOf("Opera")) !== -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) !== -1) {
          fullVersion = nAgt.substring(verOffset + 8);
        }
      }
      // In MSIE, the true version is after "MSIE" in userAgent
      else if ((verOffset = nAgt.indexOf("MSIE")) !== -1) {
          browserName = "Microsoft Internet Explorer";
          fullVersion = nAgt.substring(verOffset + 5);
        }
        // In Chrome, the true version is after "Chrome"
        else if ((verOffset = nAgt.indexOf("Chrome")) !== -1) {
            browserName = "Chrome";
            fullVersion = nAgt.substring(verOffset + 7);
          }
          // In Safari, the true version is after "Safari" or after "Version"
          else if ((verOffset = nAgt.indexOf("Safari")) !== -1) {
              browserName = "Safari";
              fullVersion = nAgt.substring(verOffset + 7);
              if ((verOffset = nAgt.indexOf("Version")) !== -1) {
                fullVersion = nAgt.substring(verOffset + 8);
              }
            }
            // In Firefox, the true version is after "Firefox"
            else if ((verOffset = nAgt.indexOf("Firefox")) !== -1) {
                browserName = "Firefox";
                fullVersion = nAgt.substring(verOffset + 8);
              }
              // In most other browsers, "name/version" is at the end of userAgent
              else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
                  browserName = nAgt.substring(nameOffset, verOffset);
                  fullVersion = nAgt.substring(verOffset + 1);
                  if (browserName.toLowerCase() === browserName.toUpperCase()) {
                    browserName = navigator.appName;
                  }
                }
      // trim the fullVersion string at semicolon/space if present
      if ((ix = fullVersion.indexOf(";")) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
      }

      if ((ix = fullVersion.indexOf(" ")) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
      }

      majorVersion = parseInt('' + fullVersion, 10);
      if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
      }

      return {
        browserName: browserName,
        fullVersion: fullVersion,
        majorVersion: majorVersion,
        appName: navigator.appName,
        userAgent: navigator.userAgent
      };
    };

    /**
     * Whether the device is mobile (not a tablet)
     * http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
     */
    var isMobileDevice = function isMobileDevice() {
      var agn = navigator.userAgent || navigator.vendor || window.opera;
      //console.log('agent', agn);
      var check = false;

      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(agn) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agn.substr(0, 4))) {
        check = true;
      }

      return check;
    };

    var cyr = /[а-яё]/ig;

    // pth = /some-url/cyrillic/asdf?name=supernameencoded
    var encodePath = function encodePath(pth) {
      var arr = pth.split('/');
      arr = arr.map(function (item) {
        if (cyr.test(item)) {
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

  angular.module('myApp.hprFactory', []).factory('hprFactory', [xpo]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	// var tbl = {
	// 	'manicure': [
	// 	  'pedicure',
	// 	  'extNail',
	// 	  'gelLacquerManicure',
	// 	  'gelManicure',
	// 	  'lacquerManicure'
	// 	  // 'unedgedManicure',
	// 	  // 'childManicure',
	// 	  // 'manManicure',
	// 	],
	// 	'pedicure': [
	// 	  'classicPedicure',
	// 	  'machinePedicure',
	// 	  'manicure'
	// 	],
	// 	'machinePedicure': [
	// 	  'pedicure'
	// 	]
	// weddingHair = weddingMakeup
	// };

	var xpo = function xpo() {

		var calcWordW = function calcWordW(rbrw, curName, plusWeight) {
			angular.forEach(rbrw.item.name.split(' '), function (word) {
				angular.forEach(curName.split(' '), function (strWord) {
					if (word.toLowerCase() === strWord.toLowerCase()) {
						rbrw.weight += plusWeight;
					}
				});
			});
		};

		// var symbols = function(str){
		//   str = str.toLowerCase();
		//   var obj = {};
		//   for (var i = 0; i < str.length; i += 1){
		// 	obj[str[i]] = 1;
		//   }	 
		// };

		// combination of two letters, like 'abcd' for 'bc'
		var calcLetterW = function calcLetterW(rbrw, curName, plusWeight) {
			curName = curName.toLowerCase();
			var itemName = rbrw.item.name.toLowerCase();
			for (var i = 1; i < itemName.length; i += 1) {
				if (curName.indexOf(itemName[i - 1] + itemName[i]) >= 0) {
					rbrw.weight += plusWeight;
				}
			}
		};

		// divide by words
		// most words
		// sort by count of masters (show number of masters)
		// arrRubric = arrServRubricStat
		var calcSimilarRubrics = function calcSimilarRubrics(arrServRubricStat, curRubric) {
			var arrRubric = arrServRubricStat.filter(function (item) {
				// if (item.serv_group_id !== curRubric.serv_group_id) {
				//   return false;
				// }

				if (item.id === curRubric.id) {
					return false;
				}

				// skip one words rubrics: высокочастотные запросы
				if (item.name.split(' ').length < 2) {
					return false;
				}

				// skip rubrics without masters (less than 5)
				// 5 - enough to choose
				if (item.count_master_serv < 5) {
					return false;
				}

				return true;
			});

			var result = arrRubric.map(function (itemRubric) {
				return {
					item: itemRubric,
					weight: 0
				};
			});

			// for a word
			result.forEach(function (rbrw) {
				return calcWordW(rbrw, curRubric.name, 10);
			});

			// for a serv group, like hair, nail
			result.forEach(function (rbrw) {
				if (rbrw.item.serv_group_id === curRubric.serv_rubric_id) {
					rbrw.weight += 10;
				}
			});

			// from 1 till 500 (/2)
			// 1 - 50, 50 - 100, 100 - 150, etc.
			// result.forEach((rbrw) => {
			// 	rbrw.weight += (rbrw.item.count_master_serv / 2);
			// });

			// for a two sequence letters
			result.forEach(function (rbrw) {
				return calcLetterW(rbrw, curRubric.name, 1);
			});

			result.sort(function (a, b) {
				return a.weight > b.weight ? -1 : 1;
			});

			// result = result.filter((rbrw) => {
			// 	return rbrw.weight >= 3;
			// });

			// first 3 elems
			return result.slice(0, 4);
		};

		return {
			calcSimilarRubrics: calcSimilarRubrics
		};
	};

	angular.module('myApp.rubricHelper', []).factory('rubricHelper', [xpo]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	var xpo = function xpo() {
		/**
   * Calculate address 
   * @returns {String}
   */
		var calcAddrFromDescription = function calcAddrFromDescription(dscr) {
			var addrObj;

			try {
				addrObj = JSON.parse(dscr);
			} catch (exc) {
				console.log('tbl parse address', exc);
				console.log('dscr', dscr);
				return '';
			}

			var tmpAddrArr = [addrObj.supRegion, addrObj.supStreet];

			tmpAddrArr = tmpAddrArr.filter(function (tmpStr) {
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
		var calcCommentFromDescription = function calcCommentFromDescription(dscr) {
			var addrObj;

			try {
				addrObj = JSON.parse(dscr);
			} catch (exc) {
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
		var calcOutGeoFromDescription = function calcOutGeoFromDescription(dscr) {
			var addrObj;

			try {
				addrObj = JSON.parse(dscr);
			} catch (exc) {
				console.log('tbl parse address', exc);
				return '';
			}

			if (!addrObj.cusRegions) {
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

	angular.module('myApp.splrAddressHelper', []).factory('splrAddressHelper', [xpo]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	var repoData = {};

	var xpo = function xpo($q, apimas, geoHelper) {
		var handleAgglo = function handleAgglo(aggloItem) {
			// save to cache
			repoData[aggloItem.local_name] = aggloItem;

			return aggloItem;
		};

		var retrieveByLocalName = function retrieveByLocalName(localName) {
			if (repoData[localName]) {
				return $q.when(repoData[localName]);
			}

			// returns entire object
			// - center (for a map)
			// - regions and districts (for categories and filter)
			// - tags (aliases - to use in text)
			return apimas.sendGet('/territory/get-agglo-by-local-name', {
				local_name: localName
			}).then(handleAgglo);
		};

		var retrieveById = function retrieveById(id) {
			var tmpAgglo;

			for (var ky in repoData) {
				if (repoData[ky].id === id) {
					tmpAgglo = repoData[ky];
				}
			}

			// load from cache
			if (tmpAgglo) {
				return $q.when(tmpAgglo);
			}

			return apimas.sendGet('/territory/get-agglo-by-id', {
				id: id
			}).then(handleAgglo);
		};

		var retrieveByCoords = function retrieveByCoords(lng, lat) {
			// try to find in cache
			var arrAgglo = [];

			for (var ky in repoData) {
				arrAgglo.push(repoData[ky]);
			}

			var tmpAgglo = geoHelper.findAggloByCoords(arrAgglo, lat, lng);

			if (tmpAgglo) {
				return $q.when(tmpAgglo);
			}

			// find in DB
			return apimas.sendGet('/territory/get-agglo-by-coords', {
				ll: lng + ',' + lat
			}).then(handleAgglo);
		};

		return {
			retrieveByLocalName: retrieveByLocalName,
			retrieveByCoords: retrieveByCoords,
			retrieveById: retrieveById
		};
	};

	angular.module('myApp.aggloItemRepo', ['myApp.apimas', 'myApp.geoHelper']).factory('aggloItemRepo', ['$q', 'apimas', 'geoHelper', xpo]);
})(window.angular);

// if (localName){
// 	if (localName !== 'Краснодар'){
// 	  return $q.reject({
// 		status: 404
// 	  });
// 	}

// 	return $q.when({
// 	  "id":23,
// 	  "inter_code":"krasnodar",
// 	  "local_name":"Краснодар",
// 	  "extent":"POLYGON((38.650082533080614 45.265381527628314,39.378568391258518 45.265290155888565,39.376447901540722 44.943555640357872,38.652042547509957 44.943645998476249,38.650082533080614 45.265381527628314))",
// 	  "centroid":"POINT(38.970325562475452 45.024565047103778)",
// 	  "geo_id":"3237387433934850",
// 	  "country_id":"ru",
// 	  "locale_id":"ru",
// 	  "tag1":null,
// 	  "tag2":null
// 	});
// }
'use strict';

(function (angular) {
	'use strict';

	var repo = {
		articles: [{
			ttl: 'Укрепление ресниц: 7 простых шагов',
			lnk: 'http://blog.miskra.ru/post/%D1%83%D0%BA%D1%80%D0%B5%D0%BF%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D1%80%D0%B5%D1%81%D0%BD%D0%B8%D1%86/',
			rubrics: ['lashesStrong', 'extEyelashes', 'lashesAll', 'lashesExtClassic', 'lashesCorrection', 'lashesModel']
		}, {
			ttl: '10 этапов домашнего ламинирования волос',
			lnk: 'http://blog.miskra.ru/post/%D0%B4%D0%BE%D0%BC%D0%B0%D1%88%D0%BD%D0%B5%D0%B5-%D0%BB%D0%B0%D0%BD%D0%BC%D0%B8%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%B2%D0%BE%D0%BB%D0%BE%D1%81/',
			rubrics: ['laminationHair', 'highlightHair', 'toningHair', 'colorationHair', 'settingHair']
		}, {
			ttl: 'Модные стрижки 2016',
			lnk: 'http://blog.miskra.ru/post/%D0%BC%D0%BE%D0%B4%D0%BD%D1%8B%D0%B5-%D1%81%D1%82%D1%80%D0%B8%D0%B6%D0%BA%D0%B8-2016/',
			rubrics: ['careHairCut', 'ladderHairCut', 'poluboksHairCut', 'womanHairCut', 'shortHairCut', 'modelHairCut', 'bobHairCut', 'cutHair', 'pixieHairCut', 'cascadeHairCut', 'middleHairCut']
		}, {
			ttl: 'Профессиональный макияж для всех',
			lnk: 'http://blog.miskra.ru/post/%D0%BF%D1%80%D0%BE%D1%84%D0%B5%D1%81%D1%81%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9-%D0%BC%D0%B0%D0%BA%D0%B8%D1%8F%D0%B6-%D0%B4%D0%BB%D1%8F-%D0%B2%D1%81%D0%B5%D1%85/',
			rubrics: ['makeupProfi', 'makeup3d', 'makeupEye', 'makeupEyelid', 'makeupProm', 'makeupHoliday', 'makeupHollywood', 'makeupBusiness', 'makeupEvening', 'makeupDaytime', 'makeupWedding', 'makeupUsual']
		}, {
			ttl: 'Секреты возрастного макияжа для мудрых женщин',
			lnk: 'http://blog.miskra.ru/post/%D1%81%D0%B5%D0%BA%D1%80%D0%B5%D1%82%D1%8B-%D0%B2%D0%BE%D0%B7%D1%80%D0%B0%D1%81%D1%82%D0%BD%D0%BE%D0%B3%D0%BE-%D0%BC%D0%B0%D0%BA%D0%B8%D1%8F%D0%B6%D0%B0-%D0%B4%D0%BB%D1%8F-%D0%BC%D1%83%D0%B4%D1%80%D1%8B%D1%85-%D0%B6%D0%B5%D0%BD%D1%89%D0%B8%D0%BD/',
			rubrics: ['makeupAge', 'makeupEast', 'makeupEye', 'makeupEyelid', 'makeupHoliday', 'makeupBusiness', 'makeupEvening', 'makeupDaytime', 'makeupUsual']
		}]
	};

	var xpo = function xpo() {

		return {
			calcByRubricId: function calcByRubricId(rubricId) {
				return repo.articles.filter(function (article) {
					return article.rubrics.indexOf(rubricId) >= 0;
				});
			}
		};
	};

	angular.module('myApp.blogRepo', []).factory('blogRepo', [xpo]);
})(window.angular);
'use strict';

// Retrieves a firm and convert to our format
(function (angular) {
  'use strict';

  var xpo = function xpo($q, firmItemFactory) {
    return {
      retrieveData: function retrieveData(id, hash) {
        return firmItemFactory.loadFirm(id, hash);
      }
    };
  };

  angular.module('myApp.firmItemRepo', ['myApp.firmItemFactory']).factory('firmItemRepo', ['$q', 'firmItemFactory', xpo]);
})(window.angular);
"use strict";

(function (angular) {
				'use strict';

				/**
     */

				var xpo = function xpo($q, firmListFactory) {

								// prev: map_data
								var repoData = {
												result: {},
												total: 0
								};

								// Translate from service group name to 2gis name
								var groupTranslation = {
												hair: {
																name: "Парикмахерские"
												},
												lashes: {
																name: "Услуги по уходу за ресницами / бровями"
												},
												nail: {
																name: 'Ногтевые студии'
												},
												makeup: {
																name: 'Услуги визажиста'
												}
								};

								var prevData = {};

								return {
												getData: function getData() {
																return repoData;
												},
												retrieveData: function retrieveData(lng, lat, servGroupId) {
																// do not load data if already loaded
																if (lng === prevData.lng && lat === prevData.lat && servGroupId === prevData.servGroupId) {

																				return $q.when(repoData);
																}

																if (!groupTranslation[servGroupId]) {
																				return $q.reject(new Error('noSuchSpec: ' + servGroupId));
																}

																//  bound%5Bpoint1%5D=37.432,55.836
																// &bound%5Bpoint2%5D=37.633,55.637
																// zoom=14 ~ 6km for big screen and 3 for small
																return firmListFactory.loadFirmsByPoint(groupTranslation[servGroupId].name, lng, lat, 3000)
																/**
                 * r - { total: 123, markers: []}
                 * total numbers of companies in current radius and city
                 */
																.then(function (r) {
																				repoData.result = r.result;
																				repoData.total = r.total;

																				prevData.lng = lng;
																				prevData.lat = lat;
																				prevData.servGroupId = servGroupId;

																				return repoData;
																});
												}
								};
				};

				angular.module('myApp.firmListRepo', ['myApp.firmListFactory']).factory('firmListRepo', ['$q', 'firmListFactory', xpo]);
})(window.angular);
'use strict';

(function (angular) {
		'use strict';

		function rearrangeArr(arr) {
				// var moscowIndex, spbIndex,
				// 	novosibirskIndex, krasnodarIndex;

				arr.sort(function (a, b) {
						return a.local_name > b.local_name ? 1 : -1;
				});

				var top = [];

				var names = ['moscow', 'spb', 'novosibirsk', 'ekaterinburg', 'n_novgorod', 'kazan', 'chelyabinsk', 'omsk'];

				// length - calculated everystep
				for (var i = 0; i < arr.length; i += 1) {
						var agg = arr[i];

						for (var k = 0; k < names.length; k += 1) {
								if (agg.inter_code === names[k]) {
										top[k] = agg;
										arr.splice(i--, 1);
								}
						}
						// if (agg.inter_code === 'moscow'){
						// 	top[0] = agg;
						// 	arr.splice(i--, 1);
						// } else if (agg.inter_code === 'spb'){
						// 	top[1] = agg;
						// 	arr.splice(i--, 1);
						// } else if (agg.inter_code === 'novosibirsk'){
						// 	top[2] = agg;
						// 	arr.splice(i--, 1);
						// } else if (agg.inter_code === 'krasnodar'){
						// 	top[3] = agg;	
						// 	arr.splice(i--, 1);
						// }
				}

				for (var j = top.length - 1; j >= 0; j -= 1) {
						arr.splice(0, 0, top[j]);
				}
		}

		var repoData = {
				arr_geo_agglo: [],
				// logic of this param: in is_perm_checked param
				is_loaded: false
		};

		var xpo = function xpo($q, apimas) {

				var setData = function setData(arr_geo_agglo) {
						// remove all prev elements
						repoData.arr_geo_agglo.length = 0;
						// add new elements
						// rearrange agglos: first msk ans spb

						var tmpArr = arr_geo_agglo;
						//r.data.arr_geo_agglo;

						rearrangeArr(tmpArr);

						// tmpArr.sort(function(a,b){
						// 	if (a.geo_id > b.geo_id){return 1;}
						// 	if (a.geo_id < b.geo_id) {return -1;}
						// 	return 0;
						// });

						angular.extend(repoData.arr_geo_agglo, tmpArr);
						// data = tmpData - break current references
						repoData.is_loaded = true;
				};

				var retrieveData = function retrieveData() {
						// console.log('try: retrieving agglos');
						// if already loaded: do not load

						if (repoData.is_loaded) {
								return $q.when(repoData.arr_geo_agglo);
								// dfr.resolve();
								// return dfr.promise;
						} else {

										////repoData.is_loaded = false;

										return apimas.sendGet("/territory/get-agglos", {}).then(function (r) {
												setData(r.arr_geo_agglo);
												return r.arr_geo_agglo;
										});
								}
				};

				return {
						retrieveData: retrieveData
				};
		};

		angular.module('myApp.geoAggloRepo', ['myApp.apimas']).factory('geoAggloRepo', ['$q', 'apimas', xpo]);
})(window.angular);
"use strict";

(function (angular) {
	'use strict';

	var obj = {
		arr_geo_region: [{
			"city": 1,
			"stations": [[251, "Берёзовая роща"], [241, "Гагаринская"], [240, "Заельцовская"], [852, "Золотая нива"], [242, "Красный проспект"], [250, "Маршала Покрышкина"], [244, "Октябрьская"], [248, "Площадь Гарина-Михайловского"], [243, "Площадь Ленина"], [247, "Площадь Маркса"], [245, "Речной вокзал"], [249, "Сибирская"], [246, "Студенческая"]],
			"districts": [[151, "Дзержинский"], [152, "Железнодорожный"], [150, "Заельцовский"], [153, "Калининский"], [154, "Кировский"], [155, "Ленинский"], [156, "Октябрьский"], [157, "Первомайский"], [158, "Советский"], [159, "Центральный"]]
		}, {
			"city": 2,
			"stations": [],
			"districts": [[263, "Кировский"], [264, "Ленинский"], [265, "Октябрьский"], [266, "Советский"], [267, "Центральный"]]
		}, {
			"city": 3,
			"stations": [],
			"districts": [[313, "Кировский"], [315, "Ленинский"], [314, "Октябрьский"], [316, "Советский"]]
		}, {
			"city": 4,
			"stations": [],
			"districts": [[399, "Железнодорожный"], [402, "Индустриальный"], [400, "Ленинский"], [403, "Октябрьский"], [401, "Центральный"]]
		}, {
			"city": 5,
			"stations": [],
			"districts": [[323, "Заводский"], [326, "Кировский"], [324, "Ленинский"], [327, "Рудничный"], [325, "Центральный"]]
		}, {
			"city": 6,
			"stations": [],
			"districts": [[429, "Заводской"], [432, "Кузнецкий"], [430, "Куйбышевский"], [433, "Новоильинский"], [431, "Орджоникидзевский"], [434, "Центральный"]]
		}, {
			"city": 7,
			"stations": [],
			"districts": [[206, "Железнодорожный"], [200, "Кировский"], [201, "Ленинский"], [202, "Октябрьский"], [204, "Свердловский"], [203, "Советский"], [205, "Центральный"]]
		}, {
			"city": 8,
			"stations": [],
			"districts": [[388, "Кировский"], [390, "Ленинский"], [389, "Советский"], [391, "Трусовский"]]
		}, {
			"city": 9,
			"stations": [[1775, "Ботаническая"], [266, "Геологическая"], [264, "Динамо"], [262, "Машиностроителей"], [265, "Площадь 1905 года"], [260, "Проспект Космонавтов"], [261, "Уралмаш"], [263, "Уральская"], [2954, "Чкаловская"]],
			"districts": [[146, "Верх-Исетский"], [149, "Железнодорожный"], [147, "Кировский"], [145, "Ленинский"], [148, "Октябрьский"], [143, "Орджоникидзевский"], [144, "Чкаловский"]]
		}, {
			"city": 11,
			"stations": [],
			"districts": [[601, "Ершовский"], [271, "Ленинский"], [273, "Октябрьский"], [272, "Правобережный"], [274, "Свердловский"]]
		}, {
			"city": 15,
			"stations": [],
			"districts": [[219, "Калининский"], [220, "Курчатовский"], [221, "Ленинский"], [222, "Металлургический"], [223, "Советский"], [224, "Тракторозаводский"], [225, "Центральный"]]
		}, {
			"city": 19,
			"stations": [[229, "Автозаводская"], [239, "Буревестник"], [238, "Бурнаковская"], [3565, "Горьковская"], [231, "Двигатель Революции"], [232, "Заречная"], [237, "Канавинская"], [227, "Кировская"], [228, "Комсомольская"], [233, "Ленинская"], [235, "Московская"], [226, "Парк Культуры"], [230, "Пролетарская"], [234, "Чкаловская"]],
			"districts": [[170, "Автозаводский"], [171, "Канавинский"], [172, "Ленинский"], [173, "Московский"], [174, "Нижегородский"], [175, "Приокский"], [176, "Советский"], [177, "Сормовский"]]
		}, {
			"city": 21,
			"stations": [[3850, "Авиастроительная"], [270, "Аметьево"], [271, "Горки"], [850, "Козья слобода"], [267, "Кремлёвская"], [268, "Площадь Габдуллы Тукая"], [620, "Проспект Победы"], [3851, "Северный вокзал"], [269, "Суконная слобода"], [3852, "Яшьлек"]],
			"districts": [[178, "Авиастроительный"], [179, "Вахитовский"], [180, "Кировский"], [181, "Московский"], [182, "Ново-Савиновский"], [183, "Приволжский"], [184, "Советский"]]
		}, {
			"city": 23,
			"stations": [],
			"districts": [[212, "Западный"], [214, "Карасунский"], [213, "Прикубанский"], [215, "Центральный"]]
		}, {
			"city": 32,
			"stations": [[1, "Авиамоторная"], [2, "Автозаводская"], [3, "Академическая"], [4, "Александровский сад"], [5, "Алексеевская"], [3569, "Алма-Атинская"], [6, "Алтуфьево"], [7, "Аннино"], [8, "Арбатская"], [9, "Аэропорт"], [10, "Бабушкинская"], [11, "Багратионовская"], [12, "Баррикадная"], [13, "Бауманская"], [14, "Беговая"], [15, "Белорусская"], [16, "Беляево"], [17, "Бибирево"], [18, "Библиотека имени Ленина"], [20, "Борисово"], [21, "Боровицкая"], [22, "Ботанический сад"], [23, "Братиславская"], [24, "Бульвар адмирала Ушакова"], [25, "Бульвар Дмитрия Донского"], [145, "Бульвар Рокоссовского"], [26, "Бунинская аллея"], [27, "Варшавская"], [28, "ВДНХ"], [29, "Владыкино"], [30, "Водный стадион"], [31, "Войковская"], [32, "Волгоградский проспект"], [33, "Волжская"], [34, "Волоколамская"], [35, "Воробьёвы горы"], [38, "Выставочная"], [36, "Выставочный центр (монорельс)"], [37, "Выхино"], [39, "Динамо"], [40, "Дмитровская"], [41, "Добрынинская"], [42, "Домодедовская"], [2247, "Достоевская"], [43, "Дубровка"], [4511, "Жулебино"], [1946, "Зябликово"], [44, "Измайловская"], [46, "Калужская"], [47, "Кантемировская"], [48, "Каховская"], [49, "Каширская"], [50, "Киевская"], [51, "Китай-город"], [52, "Кожуховская"], [53, "Коломенская"], [54, "Комсомольская"], [55, "Коньково"], [487, "Красногвардейская"], [56, "Краснопресненская"], [57, "Красносельская"], [58, "Красные ворота"], [59, "Крестьянская застава"], [60, "Кропоткинская"], [61, "Крылатское"], [62, "Кузнецкий мост"], [63, "Кузьминки"], [64, "Кунцевская"], [65, "Курская"], [66, "Кутузовская"], [67, "Ленинский проспект"], [4512, "Лермонтовский проспект"], [68, "Лубянка"], [69, "Люблино"], [70, "Марксистская"], [71, "Марьина роща"], [72, "Марьино"], [73, "Маяковская"], [74, "Медведково"], [75, "Международная"], [76, "Менделеевская"], [648, "Митино"], [77, "Молодёжная"], [650, "Мякинино"], [78, "Нагатинская"], [79, "Нагорная"], [80, "Нахимовский проспект"], [81, "Новогиреево"], [3562, "Новокосино"], [82, "Новокузнецкая"], [83, "Новослободская"], [19, "Новоясеневская"], [84, "Новые Черёмушки"], [85, "Октябрьская"], [86, "Октябрьское поле"], [87, "Орехово"], [88, "Отрадное"], [89, "Охотный ряд"], [90, "Павелецкая"], [91, "Парк культуры"], [92, "Парк Победы"], [93, "Партизанская"], [94, "Первомайская"], [95, "Перово"], [96, "Петровско-Разумовская"], [97, "Печатники"], [98, "Пионерская"], [99, "Планерная"], [101, "Площадь Ильича"], [102, "Площадь Революции"], [103, "Полежаевская"], [104, "Полянка"], [105, "Пражская"], [106, "Преображенская площадь"], [107, "Пролетарская"], [108, "Проспект Вернадского"], [109, "Проспект Мира"], [488, "Профсоюзная"], [110, "Пушкинская"], [3568, "Пятницкое шоссе"], [111, "Речной вокзал"], [112, "Рижская"], [113, "Римская"], [114, "Рязанский проспект"], [115, "Савёловская"], [116, "Свиблово"], [117, "Севастопольская"], [118, "Семёновская"], [119, "Серпуховская"], [626, "Славянский бульвар"], [120, "Смоленская"], [121, "Сокол"], [122, "Сокольники"], [123, "Спортивная"], [489, "Строгино"], [124, "Студенческая"], [125, "Сухаревская"], [126, "Сходненская"], [127, "Таганская"], [128, "Тверская"], [129, "Театральная"], [130, "Текстильщики"], [131, "Телецентр (монорельс)"], [132, "Тёплый Стан"], [133, "Тимирязевская"], [134, "Тимирязевская (монорельс)"], [135, "Третьяковская"], [4516, "Тропарёво"], [136, "Трубная"], [137, "Тульская"], [138, "Тургеневская"], [139, "Тушинская"], [140, "Улица 1905 года"], [141, "Улица Академика Королёва (монорельс)"], [142, "Улица Академика Янгеля"], [143, "Улица Горчакова"], [144, "Улица Милашенкова (монорельс)"], [146, "Улица Сергея Эйзенштейна (монорельс)"], [147, "Улица Скобелевская"], [148, "Улица Старокачаловская"], [149, "Университет"], [150, "Филёвский парк"], [151, "Фили"], [152, "Фрунзенская"], [153, "Царицыно"], [154, "Цветной бульвар"], [155, "Черкизовская"], [156, "Чертановская"], [157, "Чеховская"], [158, "Чистые пруды"], [159, "Чкаловская"], [160, "Шаболовская"], [1945, "Шипиловская"], [161, "Шоссе Энтузиастов"], [162, "Щёлковская"], [163, "Щукинская"], [164, "Электрозаводская"], [165, "Юго-Западная"], [166, "Южная"], [167, "Ясенево "]],
			"districts": [[89, "Академический"], [28, "Алексеевский"], [29, "Алтуфьевский"], [2, "Арбат"], [12, "Аэропорт"], [30, "Бабушкинский"], [3, "Басманный"], [13, "Беговой"], [14, "Бескудниковский"], [31, "Бибирево"], [73, "Бирюлёво Восточное"], [74, "Бирюлёво Западное"], [45, "Богородское"], [75, "Братеево"], [32, "Бутырский"], [46, "Вешняки"], [101, "Внуково"], [15, "Войковский"], [16, "Восточное Дегунино"], [48, "Восточное Измайлово"], [47, "Восточный"], [61, "Выхино-Жулебино"], [90, "Гагаринский"], [17, "Головинский"], [49, "Гольяново"], [76, "Даниловский"], [18, "Дмитровский"], [77, "Донской"], [102, "Дорогомилово"], [4, "Замоскворечье"], [19, "Западное Дегунино"], [91, "Зюзино"], [78, "Зябликово"], [50, "Ивановское"], [51, "Измайлово"], [62, "Капотня"], [565, "Кожухово"], [92, "Коньково"], [20, "Коптево"], [52, "Косино-Ухтомский"], [93, "Котловка"], [5, "Красносельский"], [103, "Крылатское"], [124, "Крюково"], [63, "Кузьминки"], [104, "Кунцево"], [114, "Куркино"], [21, "Левобережный"], [64, "Лефортово"], [33, "Лианозово"], [94, "Ломоносовский"], [34, "Лосиноостровский"], [65, "Люблино"], [35, "Марфино"], [36, "Марьина Роща"], [66, "Марьино"], [122, "Матушкино"], [53, "Метрогородок"], [6, "Мещанский"], [115, "Митино"], [105, "Можайский"], [22, "Молжаниновский"], [79, "Москворечье-Сабурово"], [81, "Нагатино-Садовники"], [80, "Нагатинский Затон"], [82, "Нагорный"], [67, "Некрасовка"], [68, "Нижегородский"], [106, "Ново-Переделкино"], [54, "Новогиреево"], [55, "Новокосино"], [95, "Обручевский"], [83, "Орехово-Борисово"], [84, "Орехово-Борисово Южное"], [37, "Останкинский"], [38, "Отрадное"], [107, "Очаково-Матвеевское"], [123, "Панфиловский"], [56, "Перово"], [69, "Печатники"], [116, "Покровское-Стрешнево"], [57, "Преображенское"], [7, "Пресненский"], [108, "Проспект Вернадского"], [109, "Раменки"], [39, "Ростокино"], [70, "Рязанский"], [4381, "Савёлки"], [23, "Савёловский"], [40, "Свиблово"], [96, "Северное Бутово"], [58, "Северное Измайлово"], [42, "Северное Медведково"], [117, "Северное Тушино"], [41, "Северный"], [24, "Сокол"], [59, "Соколиная Гора"], [60, "Сокольники"], [110, "Солнцево"], [118, "Строгино"], [8, "Таганский"], [9, "Тверской"], [71, "Текстильщики"], [97, "Тёплый Стан"], [25, "Тимирязевский"], [111, "Тропарёво-Никулино"], [112, "Филёвский Парк"], [113, "Фили-Давыдково"], [10, "Хамовники"], [26, "Ховрино"], [27, "Хорошевский"], [119, "Хорошёво-Мнёвники"], [88, "Царицыно"], [98, "Черёмушки"], [85, "Чертаново Северное"], [86, "Чертаново Центральное"], [87, "Чертаново Южное"], [120, "Щукино"], [99, "Южное Бутово"], [43, "Южное Медведково"], [121, "Южное Тушино"], [72, "Южнопортовый"], [11, "Якиманка"], [44, "Ярославский"], [100, "Ясенево"]]
		}, {
			"city": 38,
			"stations": [[184, "Автово"], [652, "Адмиралтейская"], [170, "Академическая"], [181, "Балтийская"], [653, "Бухарестская"], [205, "Василеостровская"], [178, "Владимирская"], [492, "Волковская"], [174, "Выборгская"], [194, "Горьковская"], [206, "Гостиный двор"], [169, "Гражданский проспект"], [168, "Девяткино"], [220, "Достоевская"], [209, "Елизаровская"], [493, "Звенигородская"], [202, "Звёздная"], [183, "Кировский завод"], [214, "Комендантский проспект"], [216, "Крестовский остров"], [203, "Купчино"], [223, "Ладожская"], [185, "Ленинский проспект"], [173, "Лесная"], [221, "Лиговский проспект"], [210, "Ломоносовская"], [207, "Маяковская"], [654, "Международная"], [201, "Московская"], [198, "Московские ворота"], [182, "Нарвская"], [195, "Невский проспект"], [222, "Новочеркасская"], [651, "Обводный канал"], [212, "Обухово"], [189, "Озерки"], [200, "Парк Победы"], [187, "Парнас"], [193, "Петроградская"], [191, "Пионерская"], [208, "Площадь Александра Невского"], [177, "Площадь Восстания"], [175, "Площадь Ленина"], [172, "Площадь Мужества"], [171, "Политехническая"], [204, "Приморская"], [211, "Пролетарская"], [224, "Проспект Большевиков"], [186, "Проспект Ветеранов"], [188, "Проспект Просвещения"], [179, "Пушкинская"], [213, "Рыбацкое"], [219, "Садовая"], [196, "Сенная площадь"], [619, "Спасская"], [218, "Спортивная"], [215, "Старая Деревня"], [180, "Технологический институт"], [190, "Удельная"], [225, "Улица Дыбенко "], [197, "Фрунзенская"], [176, "Чернышевская"], [192, "Чёрная речка"], [217, "Чкаловская"], [199, "Электросила"]],
			"districts": [[125, "Адмиралтейский"], [126, "Василеостровский"], [127, "Выборгский"], [128, "Калининский"], [129, "Кировский"], [130, "Колпинский"], [131, "Красногвардейский"], [132, "Красносельский"], [133, "Кронштадтский"], [134, "Курортный"], [135, "Московский"], [136, "Невский"], [137, "Петроградский"], [138, "Петродворцовый"], [139, "Приморский"], [140, "Пушкинский"], [141, "Фрунзенский"], [142, "Центральный"]]
		}, {
			"city": 46,
			"stations": [],
			"districts": [[318, "Восточный"], [319, "Западный"]]
		}, {
			"city": 49,
			"stations": [],
			"districts": [[249, "Варавино-Фактория"], [252, "Исакогорский"], [255, "Ломоносовский"], [250, "Маймаксанский"], [253, "Майская Горка"], [256, "Октябрьский"], [251, "Северный"], [254, "Соломбальский"], [257, "Цигломенский"]]
		}, {
			"city": 67,
			"stations": [[1779, "Абай"], [1782, "Алатау"], [1778, "Алмалы"], [1780, "Байконур"], [1777, "Жибек Жолы"], [4518, "Москва"], [1776, "Райымбек батыр"], [4519, "Сайран"], [1781, "Театр имени Мухтара Ауэзова"]],
			"districts": [[4451, "Алатауский"], [543, "Алмалинский"], [544, "Ауэзовский"], [545, "Бостандыкский"], [546, "Жетысуский"], [547, "Медеуский"], [4452, "Наурызбайский"], [548, "Турксибский"]]
		}]
	};

	angular.module('myApp.ArrGeoRegion', []).value('ArrGeoRegion', obj);
})(window.angular);
'use strict';

// ?Как выбирать станции метро для установки адреса приёма
// Ближайшее метро (авито)
// Если нет метро - то просто не указывать (указывать только адрес)

(function (angular) {
	'use strict';

	var repoData = {
		arr_geo_region: [],
		is_loaded: false
	};

	var xpo = function xpo($q, ArrGeoRegion) {
		var setData = function setData(arr_geo_region) {
			// remove all prev elements
			repoData.arr_geo_region.length = 0;
			// add new elements
			// rearrange agglos: first msk ans spb

			angular.extend(repoData.arr_geo_region, arr_geo_region);
			// data = tmpData - break current references
			repoData.is_loaded = true;
		};

		return {
			getData: function getData() {
				return repoData;
			},
			retrieveData: function retrieveData() {
				// console.log('try: retrieving agglos');
				// if already loaded: do not load

				if (repoData.is_loaded) {
					return $q.when(repoData.arr_geo_region);
					// dfr.resolve();
					// return dfr.promise;
				} else {

						////repoData.is_loaded = false;

						// var req = {
						// 	method: "GET",
						// 	url: APPCONF.APIMAS_ENDPOINT + "/territory/get-agglos"
						// };

						// return $http(req).then(setData);

						setData(ArrGeoRegion.arr_geo_region);
						return $q.when(ArrGeoRegion.arr_geo_region);
					}
			},

			isStations: function isStations(rid) {
				if (!repoData[rid]) {
					return false;
				}

				var stations = repoData[rid].stations;
				if (stations && stations.length > 0) {
					return true;
				} else {
					return false;
				}
			}
		};
	};

	angular.module('myApp.geoRegionRepo', ['myApp.ArrGeoRegion']).factory('geoRegionRepo', ['$q', 'ArrGeoRegion', xpo]);
})(window.angular);
'use strict';

/**
 * Device coordinates
 */
(function (angular) {
		'use strict';

		var repoData = {
				coords: {
						lat: null,
						lng: null
				}
		};

		var xpo = function xpo($q, geolocFactory) {

				return {
						retrieveByIp: function retrieveByIp() {
								if (repoData.coords.lng && repoData.coords.lat) {
										return $q.when(repoData.coords);
								} else {
										return geolocFactory.getByIp().then(function (coords) {
												// {"ip":"xxx","country_code":"RU","country_name":"Россия","region_code":"KDA","region_name":"Краснодарский край","city":"Краснодар","zip_code":"350000","time_zone":"Europe/Moscow","latitude":45.11,"longitude":38.99,"metro_code":0}
												repoData.coords.lng = coords.longitude;
												repoData.coords.lat = coords.latitude;

												// send coords to  next handler
												return repoData.coords;
										});
								}
						},
						retrieveFromDevice: function retrieveFromDevice() {
								// right now supported only static places
								// no need to calc every time, when a user updates a map
								if (repoData.coords.lng && repoData.coords.lat) {
										return $q.when(repoData.coords);
								} else {

										// get from device or IP
										return geolocFactory.getCurCoords().then(function (coords) {
												// 43.6078976
												// 39.744629859
												repoData.coords.lat = coords.latitude;
												repoData.coords.lng = coords.longitude;
												// send coords to  next handler
												return repoData.coords;
										});
								}
						}
				};
		};

		angular.module('myApp.locRepo', ['myApp.geolocFactory'
		// 'myApp.hprFactory'
		]).factory('locRepo', ['$q', 'geolocFactory',
		// 'hprFactory',
		xpo]);
})(window.angular);
'use strict';

(function (angular) {
  'use strict';

  /**
   * Local storage id to store permission switcher
   */

  var PERM_TABLE = 'location_permission';

  /**
   * Whether the location permissions are allowed
   * @type {boolean}
   */
  var is_perm_allowed = null;

  // NullBoolean
  var repoData = {
    /**
     * Whether the auto-recognition is tried
     *   once per app
     */
    is_perm_checked: false
  };

  var xpo = function xpo($q, localDb) {

    var saveLocationPermission = function saveLocationPermission() {
      is_perm_allowed = true;
      // save a rule: a user allows us to define his location
      localDb.writeToStorage(PERM_TABLE, {
        id: 0,
        is_allowed: true
      });
    };

    var handleLocationPermission = function handleLocationPermission(prm) {
      repoData.is_perm_checked = true;

      if (prm && prm.is_allowed === true) {
        // calc location from coords
        //$scope.defineLocation();
        //saveLocationPermission();
        is_perm_allowed = true;
      } else {
        is_perm_allowed = false;
      }

      return is_perm_allowed;
    };

    return {
      getData: function getData() {
        return repoData;
      },
      cleanLocationPermission: function cleanLocationPermission() {
        is_perm_allowed = false;
        localDb.delFromStorage(PERM_TABLE, {
          id: 0
        });
      },
      saveLocationPermission: saveLocationPermission,
      // return or (load and return)
      checkLocationPermission: function checkLocationPermission() {
        // checked once per session
        if (repoData.is_perm_checked) {
          var dfr = $q.defer();
          dfr.resolve(is_perm_allowed);
          return dfr.promise;
        } else {
          return localDb.readFromStorage(PERM_TABLE, {
            id: 0
          }, false).then(handleLocationPermission);
        }
      }
    };
  };

  angular.module('myApp.permRepo', ['myApp.localDb']).factory('permRepo', ['$q', 'localDb', xpo]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	var repoData = {
		arr_prtf_work: [],
		is_loaded: false
	};

	var xpo = function xpo($q, apimas) {

		var setData = function setData(arrServer) {
			repoData.arr_prtf_work.length = 0;

			angular.forEach(arrServer, function (v) {
				repoData.arr_prtf_work.push(v);
			});

			repoData.is_loaded = true;
		};

		/**
   * Retrieve array of work (portfolio view)
   * @param {Number} geoDistrictId
  * @param {String} servRubricId
   */
		var retrieveData = function retrieveData(servRubricId, geoDistrictId) {
			// clean prev master, if exists
			// send id of a master
			// return mp + all services + all works	 
			// + contacts + address     

			return apimas.sendGet('/work/get-portfolio', {
				geo_district_id: geoDistrictId,
				serv_rubric_id: servRubricId
			}).then(function (r) {
				// shuffle( - from hprFactory
				var smashArr = r.arr_prtf_work.slice(0, 99);
				// todo: move smash and slice methods to server side
				setData(smashArr);
				//return r.data;
				return smashArr;
			});
		};

		return {
			retrieveData: retrieveData
		};
	};

	angular.module('myApp.prtfRepo', ['myApp.apimas']).factory('prtfRepo', ['$q', 'apimas', xpo]);
})(window.angular);
"use strict";

(function (angular) {
	'use strict';

	var repoData = {
		arr_serv_group: [{
			"id": "hair",
			"serv_area_id": "beauty",
			"lang": "ru",
			"name": "Парикмахер",
			"description": null,
			"tag1": null,
			"tag2": null
		}, {
			"id": "nail",
			"serv_area_id": "beauty",
			"lang": "ru",
			"name": "Ногти",
			"description": null,
			"tag1": null,
			"tag2": null
		}, {
			"id": "lashes",
			"serv_area_id": "beauty",
			"lang": "ru",
			"name": "Ресницы",
			"description": null,
			"tag1": null,
			"tag2": null
		}, {
			"id": "makeup",
			"serv_area_id": "beauty",
			"lang": "ru",
			"name": "Визажист",
			"description": null,
			"tag1": null,
			"tag2": null
		}]
	};

	var xpo = function xpo($q, apimas) {
		var retrieveData = function retrieveData() {
			// imitation of request
			return $q.when(repoData.arr_serv_group);
		};

		var makeIds = function makeIds(arr) {
			return arr.map(function (item) {
				return item.id;
			});
		};

		var loadScope = function loadScope(ids) {
			return apimas.sendGet('/rubric/get-groups', {
				ids: ids.join('__'),
				lang: 'ru'
			});
		};

		var combineArr = function combineArr(arrScope) {
			console.log('combine', arrScope);
			repoData.arr_serv_group.forEach(function (item) {
				arrScope.forEach(function (itemScope) {
					if (itemScope.id === item.id) {
						item.arr_serv_rubric = itemScope.arr_serv_rubric;
					}
				});
			});

			return repoData.arr_serv_group;
		};

		var retrieveWithRubrics = function retrieveWithRubrics() {
			return retrieveData().then(function (arr) {
				return makeIds(arr);
			}).then(function (ids) {
				return loadScope(ids);
			}).then(function (r) {
				return combineArr(r.arr_serv_group);
			});
		};

		return {
			retrieveData: retrieveData,
			retrieveWithRubrics: retrieveWithRubrics
		};
	};

	angular.module('myApp.servGroupRepo', ['myApp.apimas']).factory('servGroupRepo', ['$q', 'apimas', xpo]);
})(window.angular);
"use strict";

/**
 * Load rubrics and statistic for groups
 *    hair: ['hairExt', 'hairCut'...] + counters
 */
(function (angular, APPCONF) {
	'use strict';

	// Default data with groups and names
	// In global scope: rubric_repo
	// repoData for each city separatelly

	var repoData = {};

	var xpo = function xpo($q, $http) {

		/**
   * Retrieve serv stat
   */
		var refreshData = function refreshData(geoDistrictId, arrServGroup) {
			// load once per geoDistrictId
			// re-load for another session (rare changes of data)
			// re-load for another city

			var idsServGroup = arrServGroup.map(function (grp) {
				return grp.id;
			});

			var req = {
				method: "GET",
				url: APPCONF.APIMAS_ENDPOINT + "/rubric/get-serv-stat",
				params: {
					// 'nail__hair__makeup__lashes'
					ids_serv_group: idsServGroup.join('__'),
					lang: 'ru',
					geo_district_id: geoDistrictId
					//ids: idsServGroup.join('__'),
					//ids_serv_group: idsServGroup.join('__'),
					//lang: lang
				}
			};

			return $http(req);
			// return localReq(lang)  //$http(req)
			// 	.then(handleResult);
			// catch errors in main code
		};

		var calcGroupName = function calcGroupName(arrServGroup, servGroupId) {
			var curGroup = arrServGroup.filter(function (grp) {
				return grp.id === servGroupId;
			})[0];

			if (curGroup) {
				return curGroup.name;
			} else {
				console.log('error: calcGroupName: no servGroupId', servGroupId);
				return null;
			}
		};

		var attachGroupNames = function attachGroupNames(arrServRubricStat, arrServGroup) {

			angular.forEach(arrServRubricStat, function (rbr) {
				rbr.serv_group_name = calcGroupName(arrServGroup, rbr.serv_group_id);
			});
			console.log('arrSRS', arrServRubricStat);
		};

		return {
			//      setData: setData, // read-only repo
			retrieveData: function retrieveData(geoDistrictId, arrServGroup) {
				// lazy loading
				// every getData request may be counted, so
				//   use lazy loading for getData and retrieveData
				var cacheObj = repoData['city' + geoDistrictId];

				if (!cacheObj) {
					return refreshData(geoDistrictId, arrServGroup).then(function (r) {

						attachGroupNames(r.data.arr_serv_rubric_stat, arrServGroup);

						repoData['city' + geoDistrictId] = r.data;
						return repoData['city' + geoDistrictId];
					});
				} else {
					return $q.when(cacheObj);
				}
			}
		};
	};

	angular.module('myApp.servStatRepo', []).factory('servStatRepo', ['$q', '$http', xpo]);
})(window.angular, window.APPCONF);

// repoData.arr_serv_group[0].arr_serv_rubric.push({
// 	id: 'supercure',
// 	lang: 'ru',
// 	serv_group_id: "nail",
// 	name: "SuperCure"
// });

//  var setData = function(tmpData) {
// // remove all prev elements
// data.length = 0;
// // add new elements
// angular.extend(data, tmpData);
// // data = tmpData - break current references
//    };

// SELECT counters FROM master mp
// WHERE mp.geo_district_id = geo_district_id
// JOIN master_serv ms
// JOIN serv_rubrics sr
// WHERE sr.serv_group_id ANY serv_group_ids
//   can be changed later to only one serv_group_id
// GROUP by sr.id
// ORDER by COUNT(ms) / per rubric

// this request doesn't touch serv_group table
// and it is better than 5 separate single requests

// from this response: calc counters per serv_group
// serv_group_id | count(rubrics) | count(master_serv)
// this request is the same JOINER, except
// - full list of rubrics, instead count(rubrics) only

// this request is better than
// global counter per serv_group
// - no need to send requests, if serv_group is changed
//   it is possible situation
// - a client can view not only counters,
//   but rubric names
// overflow inner join with rubric names: but
//   it is task of middle-db

// convert from response to our object
// group by serv_group
// do not remove serv_groups:
// clean only arr_serv_rubric
// and add news one
// Add all array at a moment: do not add items separately
//   it might occur an error during double-request  
// var handleResult = function(r){
//   //console.log(r.data);
//   // group by serv_groups
//   repoData.arr_serv_group.length = 0;
//   angular.extend(repoData.arr_serv_group,
// 				 r.data.arr_serv_group);

//   // attach new values (filters)
//   //repoData.geo_district_id = r.data.geo_district_id;
//   //      console.log(repoData);
//   /**
//    * Whether the rubrics are loaded
//    */
//   repoData.is_loaded = true;

//   return repoData;
// };

// var localReq = function(){
//   var dfr = $q.defer();

//   // $timeout(function(){
//   // 	dfr.reject('some error');
//   dfr.resolve({
//   	data: arrRubricFactory
//   });
//   // }, 1000);

//   return dfr.promise;
// };

// var repoData = {
//   arr_serv_group: [],
//   lang: "ru",
//   geo_district_id: null,
// 	//	ids_serv_group: null
//   // load once per app, per city
//   // re-load for another session (rare changes of data)
//   // re-load for another city
//   is_loaded: false
// };
'use strict';

(function (window, angular, SNNS) {
	'use strict';

	var repoData = {
		/**
   * Expired, utc unix timestamp, int32
   * @type {Number}
   */
		exp: null,

		/**
   * User id, 6-digits int32
   * @type {Number}
   */
		uid: null,

		/**
   * Perms, bitmask, int32
   * @type {Number}
   */
		perms: null,

		/**
   * Whether the repo is already filled
   * @type {Boolean}
   */
		is_loaded: false
	};

	var parseToken = function parseToken(tkn) {
		var str = '';

		var payload = tkn.split('.')[1];
		if (!payload) {
			return null;
		}

		try {
			str = window.atob(payload);
		} catch (exc) {
			console.log(exc);
			return null;
		}

		var result;

		try {
			result = JSON.parse(str);
		} catch (exc) {
			console.log(exc);
			return null;
		}

		return result;
	};

	var xpo = function xpo($q, localDb) {
		var tblName = 'sess';
		var idDefault = 0;

		var setData = function setData(payload) {
			//console.log(payload);

			repoData.token = payload.token;

			repoData.exp = payload.exp;
			repoData.perms = payload.perms;
			repoData.uid = payload.uid;
			repoData.is_supplier = payload.is_supplier;
			repoData.is_editor = payload.is_editor;
			// is_moder includes is_editor
			repoData.is_moder = payload.is_moder;

			repoData.avatar = payload.avatar;
			repoData.fname = payload.fname;
			repoData.lname = payload.lname;

			repoData.is_loaded = true;
		};

		var cleanData = function cleanData() {
			console.log('no auth: clean data');
			repoData.exp = null;
			repoData.perms = null;
			repoData.uid = null;
			repoData.is_supplier = false;
			repoData.is_editor = false;
			repoData.is_moder = false;

			repoData.avatar = null;
			repoData.fname = null;
			repoData.lname = null;

			repoData.is_loaded = true;
		};

		return {
			getData: function getData() {
				return repoData;
			},
			// A user may remove a token from localStorage
			// In this case - no two-binding - no view refreshing
			// Need to:
			//  - refresh page (new auth value will be setted)
			//  - logout, using app buttons (all will be cleaned)

			retrieveSess: function retrieveSess() {
				if (repoData.is_loaded) {
					//console.log('sess: cache');
					return $q.when();
				}
				//console.log('sess: initial');
				// depends of app: VK, site, etc.
				// Site, Android, IPhone: get from localStorage
				// VK, FB: get from social methods
				if (SNNS.getAuthUser) {
					var dfr = $q.defer();

					SNNS.getAuthUser(function (err, authUser) {
						if (err) {
							dfr.reject(err.message);
						} else {
							dfr.resolve(authUser);
						}
					});

					var prms = dfr.promise;

					prms.then(function (authUser) {
						console.log('setDataAuthUser', authUser);
						setData({
							// vk_id
							uid: authUser.id,
							// is_customer
							is_supplier: false,
							is_editor: false,
							is_moder: false,
							fname: authUser.first_name,
							lname: authUser.last_name,
							avatar: authUser.photo_50
						});
					});

					return prms;
				} else {

					return localDb.readFromStorage(tblName, {
						id: idDefault
					}, false).then(function (record) {
						//console.log(record);
						if (!record || !record.token) {
							cleanData();
							return null;
							// return $q.reject('Ошибка авторизации: неправильный токен1.');
						}

						var payload = parseToken(record.token);

						if (!payload) {
							return $q.reject('Ошибка авторизации: неправильный токен');
						}

						setData({
							uid: payload.uid,
							token: record.token,
							is_supplier: [1, 2, 3].indexOf(payload.uid) === -1,
							is_editor: [2, 3].indexOf(payload.uid) >= 0,
							is_moder: [2].indexOf(payload.uid) >= 0
						});

						return null; // nothing to return
					});
					// handle a error event in main code
				}
			},
			updateSess: function updateSess(authToken) {
				var payload = parseToken(authToken);

				if (!payload) {
					return $q.reject('Ошибка авторизации: неправильный токен');
				}

				setData({
					uid: payload.uid,
					token: authToken,
					is_supplier: [1, 2, 3].indexOf(payload.uid) === -1,
					is_editor: [2, 3].indexOf(payload.uid) >= 0,
					is_moder: [2].indexOf(payload.uid) >= 0
				});

				return localDb.writeToStorage(tblName, {
					id: idDefault,
					token: authToken
				});
			},
			deleteSess: function deleteSess() {
				cleanData();

				return localDb.delFromStorage(tblName, {
					id: idDefault
				});
			}
		};
	};

	angular.module('myApp.sessRepo', ['myApp.localDb']).factory('sessRepo', ['$q', 'localDb', xpo]);
})(window, window.angular, window.snns);
'use strict';

(function (angular) {
  'use strict';

  var statePrev = {
    url: ''
    // params
    // time
    // etc.
  };

  var xpo = function xpo() {
    return statePrev;
  };

  angular.module('myApp.statePrev', []).factory('statePrev', [xpo]);
})(window.angular);
'use strict';

// Retrieve master profile (from Insta)
(function (angular) {
  'use strict';

  // {"id":115556,
  //  "name":"somdsfsdf",
  //  "main_phone":"+234234",
  //  "main_email":null,
  //  "modified":1420059600,
  //  "created":1420059600,
  //  "is_verified":false,"is_active":false,
  //  "exp_entire":null,"exp_private":null,
  //  "gender":null,
  //  "lname":null,"fname":null,"mname":null,
  //  "avatar":null,
  //  "master_address":{
  //    "master_profile_id":115556,
  //    "geo_district_id":32,
  //    "description":"asdfasdf",
  //    "coords":null}};

  var xpo = function xpo($q, apimas) {

    var endpoint = '/master/get-profile';
    /**
     * Retrieve master detail, like address, email, etc
     * @param {Stirng|Number} id
     */
    var retrieveData = function retrieveData(id) {

      // clean prev master, if exists
      // send id of a master
      // return mp + all services + all works	 
      // + contacts + address

      var url_params = {
        id: id
      };

      return apimas.sendGet(endpoint, url_params);
    };

    return {
      // may be cached
      retrieveData: retrieveData
    };
  };

  angular.module('myApp.supItemRepo', ['myApp.apimas']).factory('supItemRepo', ['$q', 'apimas', xpo]);
})(window.angular);
'use strict';

/**
 * List of suppliers (for tbl view)
 */
(function (angular) {

	'use strict';

	var repoData = {
		arr_supplier: []
	};

	var xpo = function xpo($q, $window, apimas) {
		var cleanArr = function cleanArr() {
			repoData.arr_supplier.length = 0;
		};

		var addData = function addData(arr_master_detail) {

			// arr_supplier === arr_master_detail
			angular.forEach(arr_master_detail, function (spl) {
				spl.arr_serv_work = [];
				spl.arr_master_serv = [];
				repoData.arr_supplier.push(spl);
			});
		};

		// var attachWorks = function(arr_table_work){
		//   angular.forEach(repoData.arr_supplier, function(spl){
		// 	var tmpArr = [];
		// 	angular.forEach(arr_table_work, function(wrk){
		// 	  if (spl.id === wrk.master_profile_id){
		// 		tmpArr.push(wrk);
		// 	  }
		// 	});
		// 	if (tmpArr.length > 0){
		// 	  spl.arr_serv_work = tmpArr;
		// 	}
		//   });
		// };

		// var portionStep = 10;
		// // with 50-step
		// // ids: master ids
		// var rtvPortion = function(ids, serv_rubric_id, ind){
		//   var idsPortion = ids.slice(ind, ind + portionStep);

		//   if (idsPortion.length > 0){

		// 	apimas.sendGet("/work/get-by-masters", {
		// 	  ids_master_profile: idsPortion.join('__'),
		// 	  serv_rubric_id: serv_rubric_id
		// 	}).then(function(result){
		// 	  attachWorks(result.arr_table_work);
		// 	  rtvPortion(ids, serv_rubric_id, ind + portionStep);
		// 	});
		//   }
		// };

		// var retrieveWorks = function(arr_master_detail, serv_rubric_id){
		//   var ids = arr_master_detail.map(function(v){
		// 	return v.id;
		//   });

		//   rtvPortion(ids, serv_rubric_id, 0);
		// };

		var retrieveByRubric = function retrieveByRubric(servBlaId, geoDistrictId, reqName, limit) {

			var params = {
				serv_rubric_id: servBlaId,
				geo_district_id: geoDistrictId
			};

			if (reqName) {
				params.req_name = reqName;
			}

			if (limit) {
				params.limit = limit;
			}

			return apimas.sendGet("/master/get-by-rubric", params).then(function (result) {
				var arr = result.arr_master_detail;
				if (!arr) {
					return $q.reject('no arr_master_detail');
				}
				// show first 99 (use reqParam:limit for this purpose)
				//arr = arr.slice(0, 99);
				cleanArr();
				addData(arr);
				//retrieveWorks(arr, servBlaId);
				return arr;
			});
		};

		return {
			// only one repo array for group/rubric/agglo
			//	  retrieveByGroup: retrieveByGroup,
			retrieveByRubric: retrieveByRubric,
			// retrieveByAgglo: retrieveByAgglo,
			// to refresh data - use internal methods:
			//    like: refreshByGroup
			//    this method included in 'retrive' methods

			// clean it during new view processing
			cleanArrSupplier: cleanArr
		};
	};

	angular.module('myApp.supListRepo', ['myApp.apimas']).factory('supListRepo', ['$q', '$window', 'apimas', xpo]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	var drct = function drct(lgr, hprFactory) {
		// lazy loading: only once: singleton
		var idPre = 'commentform';

		if (window.VK && window.VK.Observer) {
			// https://vk.com/dev/widget_comments
			var cbkNewComment = function cbkNewComment(num, last_comment, date) {
				lgr.warn('newComment', 'from a comment form', {
					num: num,
					last_comment: last_comment,
					date: date
				});
			};

			// only once per all widgets
			window.VK.Observer.subscribe("widgets.comments.new_comment", cbkNewComment);
		}

		// https://vk.com/dev/widget_comments
		var buildWidget = function buildWidget(parentBlock, pageId, pageUrl) {

			if (!pageId || !pageUrl) {
				throw new Error("commentForm: required pageId and pageUrl");
			}

			lgr.info('pageUrl', decodeURI(pageUrl));
			lgr.info('pageId', pageId);

			if (!window.VK || !window.VK.Widgets || !window.VK.Widgets.Comments) {
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
			link: function link(scope, elems, attrs) {
				// executed for each widget
				if (!attrs.subjectId) {
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
	angular.module('myApp.appCommentForm', ['myApp.hprFactory']).directive('appCommentForm', ['lgr', 'hprFactory', drct]);
})(window.angular);
'use strict';

(function (angular, APPCONF) {
  'use strict';

  var Xpo = function Xpo($scope) {
    // console.log('appconf', APPCONF);
    // OAUTH only for web apps
    $scope.is_web = !!APPCONF.OAUTH_VKN_ID;
  };

  var drct = function drct() {
    return {
      restrict: 'A',
      templateUrl: 'drct/app-footer/app-footer.tpl.html',
      controller: ['$scope', Xpo]
    };
  };

  angular.module('myApp.appFooter', ['myApp.appInformer']).directive('appFooter', [drct]);
})(window.angular, window.APPCONF);
'use strict';

(function (angular) {
  'use strict';

  var drct = function drct() {

    return {
      restrict: 'A',
      templateUrl: 'drct/app-informer/app-informer.tpl.html'
    };
  };

  angular.module('myApp.appInformer', []).directive('appInformer', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	var drct = function drct() {

		return {
			restrict: 'A',
			templateUrl: 'drct/app-share-block/app-share-block.tpl.html',
			scope: {
				title: '@',
				permalink: '@',
				pageImage: '@'
			}
		};
	};

	angular.module('myApp.appShareBlock', []).directive('appShareBlock', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	var drct = function drct() {
		return {
			restrict: 'A',
			scope: {
				arrSearchItem: '=',
				aggloName: '=',
				specName: '=',
				rubricName: '=',
				rviewId: '=',
				rviewName: '=',
				splrId: '=',
				splrName: '='
			},
			templateUrl: 'drct/app-toolbar/app-toolbar.tpl.html'
		};
	};

	angular.module('myApp.appToolbar', []).directive('appToolbar', [drct]);
})(window.angular);
'use strict';

// https://vk.com/dev/widget_like

(function (angular) {
	'use strict';

	var drct = function drct(apimas, hprFactory) {
		var preId = "vklike";

		if (window.VK && window.VK.Observer) {
			// https://vk.com/dev/widget_like
			var cbkNewLike = function cbkNewLike(likeCount) {
				console.log('new like', likeCount);

				apimas.sendRegFree({
					link: 'New like: ' + new Date().toString() + ': ' + likeCount
				}).then(function () {
					console.log('like reg-free success');
				}).catch(function (e) {
					console.log('like reg-free error');
					console.log(e);
				});
			};

			// only once per all widgets
			// no variants to send pageId
			// maybe just using unsubscribe first (all previous)
			window.VK.Observer.subscribe("widgets.like.liked", cbkNewLike);
		}

		var buildWidget = function buildWidget(parentBlock, pageId, pageUrl, pageImage, pageTitle, pageDescription) {

			if (!pageId || !pageUrl) {
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

			if (hprFactory.isMobileDevice()) {
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

			if (pageImage) {
				opts.image = pageImage;
				opts.pageImage = pageImage;
			}

			//console.log('opts', opts);
			var block = document.createElement('div');
			block.id = preId + pageId;

			parentBlock.appendChild(block);

			// draw a button
			// todo: add an event to track this event
			window.VK.Widgets.Like(block.id, opts, pageId);
		};

		var linkFunc = function linkFunc(scope, elems, attrs) {

			console.log('appVkLike', elems[0]);

			if (!attrs.subjectId) {
				throw new Error('required subjectId');
			}

			// convert unique string to unique id
			// subjectId depends of type and id of subject
			// - supplier123456
			// - media432423
			var pageId = hprFactory.toHashCode(attrs.subjectId);

			buildWidget(elems[0], pageId, attrs.subjectUrl, attrs.pageImage, attrs.pageTitle, attrs.pageDescription);
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

	angular.module('myApp.appVkLike', ['myApp.apimas', 'myApp.hprFactory']).directive('appVkLike', ['apimas', 'hprFactory', drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	// var xpo = function($scope, $location){
	// 	$scope.saveHash = function(hashString){
	// 	  if (hashString){
	// 		$location.hash(hashString);
	// 	  }
	// 	};	
	// };

	var drct = function drct($state, apimas) {

		var linkFunc = function linkFunc(scope, elems) {

			var prv = document.createElement('img');

			// prv.onload = function(){
			// 	console.log('images loaded', scope.item.id);
			// };

			prv.onerror = function (err) {
				prv.onerror = null;
				prv.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAC4ALgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3qiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAQ9DRSnoaKACiiigAooooAKKKKACjpUMk6pwOT/KqzSM/3j+FAFpriNeh3fSojcseigVBTlVm6AmgB/wBok9f0o8+T+9+lAgk9PzNL9mf/AGaAE8+T+9n8KcLlh1UGmm3kHbP0NMKMvVSKALS3CN1yPrUoIIyDWfSo7IflOKAL9FQxzhuG4P6VNQAUUUUAFFFFAAehooPQ0UAFFFFABRRRQAVVmnJyqdPX1onlydinjv71BQAVJHC0nsvqaWAIXw3XsKuUARJAi9sn3qWiigAooooAKKKKAI3hRu2D6iq7wMnPUetXKKAM+pYpinytyP5VJLAD8yDB9PWq3160AaAORkHiiqkEuw7W+6f0q3QAUUUUAB6Gig9DRQAUUUUAFRTybEwOpqWqEj73LUANqUQM0e4dewpIU8x+fujk1doAz6tQzbvlY8+vrSTQ7vmXr3HrVbvQBoUVDDNu+Vj83r61NQAUVG0yIcE8+1N+0Lno1AE1FMWVH6Hn0p9ABRRTQ6k4DAmgB1QTxbvnXr3qeigDPqzbybl2nqOlRTx7HyPummIxRgw7UAX6KQEEAjvS0AB6Gig9DRQAUUUUARTttix3PFU6nuW+cD0FRIu5wPU0AW4F2xj1PNPZgoyTgUtV7onCjtQAG69E4+tIyiZS6cN3FQUqsUO4daAEqdJPNQxscN2PrSMomXen3u4qCgCaJRHLh+OOM1Z3L6iq6sJl2P8Ae7GozE6nlT9aACTb5hKdKkS4ZVww3e9Q0UATm5JUjb+tQKdrBsdKKKALAuueU4+tTqwdcg8VQqe1PLDtigCaVd8ZHfqKo1o1RkG2Rh70AWLZsx49KmqpbNiQj1FW6AA9DRQehooAKKKKAKdx/rj7YotxmYfnRP8A65qW2/1n4UAW6r3X8FWKr3X8FAFeiiigBVYowYcEVMyiZd6fe7ioKuQrtiX35oApdKtQzbvlbr6+tE0O7LL17j1qr396ALzxq45HPrVR0MbbTU8M2/Ct19fWluVzHu7g0AVaKKKACp7X7zfSoKntfvN9KALNVLkYk+oq3Va5++v0oAiiOJVPvV6qC/eGPWr9AAehooPQ0UAFFFFAFOfiY0W5xKPenXI+cH1FRIdrqfQ0AX6r3X8FWKr3X8NAFeiiigAq9GcxqR6VRqxbyfwH8KALFQTQ7vmX73f3qeigDOqwknmoY2OG7H1p80O75lHzdx61VoAVlKNhhgikqdWEy7HOG7GoWUo2GGCKAEqe1+830qCprX7zfSgC1VS5OZR7CrdUZW3SMfegAiGZFHvV6qlsMyZ7AVboAD0NFB6GigAooooAiuF3R59KqVoEZGDVB1KOV9KALcL7ox6jg0y6HCntmooJNj89D1q2QCMHkGgChRVk2q54Yij7MP736UAVqKs/Zh/e/Sj7MP736UARpcOvB+Ye9P8AtQ/uGl+zD+9+lH2Yf3v0oAja4ckEcAU5lEyl0+93FO+zD+9+lKtvsbcHIP0oAq/zqZWEy7H4YdDT5od2WX73f3qr3oAcylGwRyKmtQcse3ShGWYBJPvdj61YVQoAAwKAGyNsjJ79qo1NcSbm2joKjVSzADqaALNsuEJ9ampFAVQB0FLQAHoaKD0NFABRRRQAVDPHuXcOo/lU1FAGfVmCXcNjde3vUc8W07h909vSoqANCioIp93yvwfX1qegAooooAKKKKACiiigAqCaHd8yj5vT1qeigDO/nU/2hvL2/wAXrST7N3y/e74qKgBKtW0eBvPU9Kihi8w5P3R+tXKACiiigAPQ0UHoaKACiiigAooooACMgg9KqSwFPmXlf5VbooAz6kjnZBg8rUsluG5Xg+lV2VkOGBFAFxZUfoefQ0+s408SOvRjQBeoqoLlx6H8KX7S390UAWqKqG5c9ABTGldurGgC28qJ1P4VXknZuF4H61D9acqsxwoyaAG1LFCZOTwv86kjtwOX5PpVigBAAowBgCloooAKKKKAA9DRQehooAKKKKACiiigAooooAKQgEYIyKWigCFrZD93K1EbZx0wat0UAUTE46qabtPTBrQooAoiNyeFNPFs564H41booAhW2UdSTUoAUYAwKWigAooooAKKKKACiiigAPQ0UHoaKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAD0NFFFAH//Z';

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
			if (hsh) {
				lnk.onclick = function () {
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

			scope.$watch('isShowImage', function (nval) {
				if (nval) {
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

	angular.module('myApp.appGalleryItem', ['myApp.apimas']).directive('appGalleryItem', ['$state', 'apimas', drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	// Couldn't autodetect L.Icon.Default.imagePath
	// ./ this relative path doesn't work on mobile (for js attach)

	var base64icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAGmklEQVRYw7VXeUyTZxjvNnfELFuyIzOabermMZEeQC/OclkO49CpOHXOLJl/CAURuYbQi3KLgEhbrhZ1aDwmaoGqKII6odATmH/scDFbdC7LvFqOCc+e95s2VG50X/LLm/f4/Z7neY/ne18aANCmAr5E/xZf1uDOkTcGcWR6hl9247tT5U7Y6SNvWsKT63P58qbfeLJG8M5qcgTknrvvrdDbsT7Ml+tv82X6vVxJE33aRmgSyYtcWVMqX97Yv2JvW39UhRE2HuyBL+t+gK1116ly06EeWFNlAmHxlQE0OMiV6mQCScusKRlhS3QLeVJdl1+23h5dY4FNB3thrbYboqptEFlphTC1hSpJnbRvxP4NWgsE5Jyz86QNNi/5qSUTGuFk1gu54tN9wuK2wc3o+Wc13RCmsoBwEqzGcZsxsvCSy/9wJKf7UWf1mEY8JWfewc67UUoDbDjQC+FqK4QqLVMGGR9d2wurKzqBk3nqIT/9zLxRRjgZ9bqQgub+DdoeCC03Q8j+0QhFhBHR/eP3U/zCln7Uu+hihJ1+bBNffLIvmkyP0gpBZWYXhKussK6mBz5HT6M1Nqpcp+mBCPXosYQfrekGvrjewd59/GvKCE7TbK/04/ZV5QZYVWmDwH1mF3xa2Q3ra3DBC5vBT1oP7PTj4C0+CcL8c7C2CtejqhuCnuIQHaKHzvcRfZpnylFfXsYJx3pNLwhKzRAwAhEqG0SpusBHfAKkxw3w4627MPhoCH798z7s0ZnBJ/MEJbZSbXPhER2ih7p2ok/zSj2cEJDd4CAe+5WYnBCgR2uruyEw6zRoW6/DWJ/OeAP8pd/BGtzOZKpG8oke0SX6GMmRk6GFlyAc59K32OTEinILRJRchah8HQwND8N435Z9Z0FY1EqtxUg+0SO6RJ/mmXz4VuS+DpxXC3gXmZwIL7dBSH4zKE50wESf8qwVgrP1EIlTO5JP9Igu0aexdh28F1lmAEGJGfh7jE6ElyM5Rw/FDcYJjWhbeiBYoYNIpc2FT/SILivp0F1ipDWk4BIEo2VuodEJUifhbiltnNBIXPUFCMpthtAyqws/BPlEF/VbaIxErdxPphsU7rcCp8DohC+GvBIPJS/tW2jtvTmmAeuNO8BNOYQeG8G/2OzCJ3q+soYB5i6NhMaKr17FSal7GIHheuV3uSCY8qYVuEm1cOzqdWr7ku/R0BDoTT+DT+ohCM6/CCvKLKO4RI+dXPeAuaMqksaKrZ7L3FE5FIFbkIceeOZ2OcHO6wIhTkNo0ffgjRGxEqogXHYUPHfWAC/lADpwGcLRY3aeK4/oRGCKYcZXPVoeX/kelVYY8dUGf8V5EBRbgJXT5QIPhP9ePJi428JKOiEYhYXFBqou2Guh+p/mEB1/RfMw6rY7cxcjTrneI1FrDyuzUSRm9miwEJx8E/gUmqlyvHGkneiwErR21F3tNOK5Tf0yXaT+O7DgCvALTUBXdM4YhC/IawPU+2PduqMvuaR6eoxSwUk75ggqsYJ7VicsnwGIkZBSXKOUww73WGXyqP+J2/b9c+gi1YAg/xpwck3gJuucNrh5JvDPvQr0WFXf0piyt8f8/WI0hV4pRxxkQZdJDfDJNOAmM0Ag8jyT6hz0WGXWuP94Yh2jcfjmXAGvHCMslRimDHYuHuDsy2QtHuIavznhbYURq5R57KpzBBRZKPJi8eQg48h4j8SDdowifdIrEVdU+gbO6QNvRRt4ZBthUaZhUnjlYObNagV3keoeru3rU7rcuceqU1mJBxy+BWZYlNEBH+0eH4vRiB+OYybU2hnblYlTvkHinM4m54YnxSyaZYSF6R3jwgP7udKLGIX6r/lbNa9N6y5MFynjWDtrHd75ZvTYAPO/6RgF0k76mQla3FGq7dO+cH8sKn0Vo7nDllwAhqwLPkxrHwWmHJOo+AKJ4rab5OgrM7rVu8eWb2Pu0Dh4eDgXoOfvp7Y7QeqknRmvcTBEyq9m/HQQSCSz6LHq3z0yzsNySRfMS253wl2KyRDbcZPcfJKjZmSEOjcxyi+Y8dUOtsIEH6R2wNykdqrkYJ0RV92H0W58pkfQk7cKevsLK10Py8SdMGfXNXATY+pPbyJR/ET6n9nIfztNtZYRV9XniQu9IA2vOVgy4ir7GCLVmmd+zjkH0eAF9Po6K61pmCXHxU5rHMYd1ftc3owjwRSVRzLjKvqZEty6cRUD7jGqiOdu5HG6MdHjNcNYGqfDm5YRzLBBCCDl/2bk8a8gdbqcfwECu62Fg/HrggAAAABJRU5ErkJggg==';
	var base64shadow = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAYAAACoYAD2AAAC5ElEQVRYw+2YW4/TMBCF45S0S1luXZCABy5CgLQgwf//S4BYBLTdJLax0fFqmB07nnQfEGqkIydpVH85M+NLjPe++dcPc4Q8Qh4hj5D/AaQJx6H/4TMwB0PeBNwU7EGQAmAtsNfAzoZkgIa0ZgLMa4Aj6CxIAsjhjOCoL5z7Glg1JAOkaicgvQBXuncwJAWjksLtBTWZe04CnYRktUGdilALppZBOgHGZcBzL6OClABvMSVIzyBjazOgrvACf1ydC5mguqAVg6RhdkSWQFj2uxfaq/BrIZOLEWgZdALIDvcMcZLD8ZbLC9de4yR1sYMi4G20S4Q/PWeJYxTOZn5zJXANZHIxAd4JWhPIloTJZhzMQduM89WQ3MUVAE/RnhAXpTycqys3NZALOBbB7kFrgLesQl2h45Fcj8L1tTSohUwuxhy8H/Qg6K7gIs+3kkaigQCOcyEXCHN07wyQazhrmIulvKMQAwMcmLNqyCVyMAI+BuxSMeTk3OPikLY2J1uE+VHQk6ANrhds+tNARqBeaGc72cK550FP4WhXmFmcMGhTwAR1ifOe3EvPqIegFmF+C8gVy0OfAaWQPMR7gF1OQKqGoBjq90HPMP01BUjPOqGFksC4emE48tWQAH0YmvOgF3DST6xieJgHAWxPAHMuNhrImIdvoNOKNWIOcE+UXE0pYAnkX6uhWsgVXDxHdTfCmrEEmMB2zMFimLVOtiiajxiGWrbU52EeCdyOwPEQD8LqyPH9Ti2kgYMf4OhSKB7qYILbBv3CuVTJ11Y80oaseiMWOONc/Y7kJYe0xL2f0BaiFTxknHO5HaMGMublKwxFGzYdWsBF174H/QDknhTHmHHN39iWFnkZx8lPyM8WHfYELmlLKtgWNmFNzQcC1b47gJ4hL19i7o65dhH0Negbca8vONZoP7doIeOC9zXm8RjuL0Gf4d4OYaU5ljo3GYiqzrWQHfJxA6ALhDpVKv9qYeZA8eM3EhfPSCmpuD0AAAAASUVORK5CYII=';

	// lfl.Icon.Default.iconUrl = base64icon;
	// lfl.Icon.Default.shadowUrl = base64shadow;
	//imagePath = './img';

	// L.icon = function (options) {
	// 	return new L.Icon(options);
	// };

	var drct = function drct() {

		//		  console.log('LFLDIRECTIVE FUNC');

		var initMap = function initMap($scope, lfl, elm, curLng, curLat, curZoom) {
			var createIcon = function createIcon() {
				return new lfl.Icon.Default({
					iconUrl: base64icon,
					shadowUrl: base64shadow,
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				});
			};

			var defaultIcon = createIcon();

			var map = lfl.map(elm, {
				center: [curLat, curLng],
				zoom: curZoom
			});

			lfl.tileLayer('https:////{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				//opacity: 0.9,
				detectRetina: true,
				reuseTiles: true,
				attribution: '© <a target="_blank" href="//www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a target="_blank" href="http://api.2gis.ru/">Предоставлено 2ГИС</a>'
			}).addTo(map);

			// console.log(scope.mapMarkers);

			map.on('moveend', function () {
				//console.log('moveend', e); // type, target

				var newCntr = map.getCenter();
				var newZoom = map.getZoom();

				$scope.mapMove()(newCntr.lng, // new values
				newCntr.lat, newZoom, curLng, // prev values
				curLat, curZoom);

				curLng = newCntr.lng;
				curLat = newCntr.lat;
				curZoom = newZoom;
			});

			var createMarker = function createMarker(mdata) {
				var mrkr = new lfl.Marker([mdata.lat, mdata.lng], {
					icon: defaultIcon,
					title: mdata.title
				});

				mrkr.bindPopup(mdata.message);
				return mrkr;
				//		  .setIcon(defaultIcon);
			};

			var curGroup = lfl.layerGroup();
			curGroup.addTo(map);

			var updateMarkers = function updateMarkers(newMarkers) {
				console.log(newMarkers);
				// remove prev markers
				//console.log('update markers');
				curGroup.clearLayers();

				for (var keyMarker in newMarkers) {
					curGroup.addLayer(createMarker(newMarkers[keyMarker]));
				}

				//map.removeLayer(groupNew);
			};

			$scope.$watch('mapMarkers', updateMarkers);

			var startCenter = map.getCenter();
			$scope.mapMove()(startCenter.lng, // new values
			startCenter.lat, map.getZoom(), null, // prev values
			null, null);
		};

		var linkFunc = function linkFunc($scope, elems) {
			// attrs

			if (!$scope.startLng || !$scope.startLat || !$scope.startZoom) {
				throw new Error('required: coords and zoom');
			}

			if (!$scope.mapMove) {
				throw new Error('required mapMove');
			}

			if (typeof $scope.mapMove !== 'function') {
				throw new Error('required mapMove function');
			}

			var curLng = $scope.startLng,
			    curLat = $scope.startLat,
			    curZoom = $scope.startZoom;

			//SNNS.loadMapLib(function(lfl){
			initMap($scope, window.L, elems[0], curLng, curLat, curZoom);
			//});
		};

		return {
			restrict: 'A',
			scope: {
				startLng: '@',
				startLat: '@',
				startZoom: '@',
				mapMarkers: '=',
				mapMove: '&' //  function
			},
			link: linkFunc
		};
	};

	angular.module('myApp.lflMap', []).directive('lflMap', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	// var parentEl = angular.element(document.body);

	var xpo = function xpo($scope, $location) {

		$scope.saveHash = function (hashString) {
			$location.hash(hashString);

			// a scroll position in pixels, like 120px is not fit
			// user can change a size of a screen (maximize, minimize)
			// and a scroll can be changed
			// document.documentElement.scrollTop || document.body.scrollTop);
		};
	};

	var drct = function drct() {

		return {
			restrict: 'A', // only attribute
			templateUrl: 'drct/tbl-item/tbl-item.tpl.html',
			scope: {
				cityName: '=',
				supItem: '=', // same as '=supItem'
				//retrieveFunc: '&'
				isEditable: '='
			},
			controller: ['$scope', '$location', xpo]
		};
	};

	angular.module('myApp.appTblItem', []).directive('appTblItem', [drct]);
})(window.angular);

// 	$scope.showFullWork = function(ev, curIndex, allWorks){
// 	  $mdDialog.show({
// 		clickOutsideToClose: true,
// 		//preserveScope: true,
// 		parent: parentEl,
// 		controller: '',
// 		templateUrl: '',
// 		// hide dialog in this ev.point (animation)
// 		targetEvent: ev,
// 		locals: {
// 		  reqOpts: {
// 			cur_index: curIndex,
// 			arr_serv_work: allWorks
// 		  }
// 		}
//     });
// 	  // console.log(curIndex);
// 	  // console.log(allWorks);
// 	};
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
	'use strict';

	var Xpo = function Xpo($scope, $state, sessRepo) {
		_classCallCheck(this, Xpo);

		/**
   * Link to login page
   * @type {String}
   */
		$scope.href_login = $state.href('byt.oauthLogin', {});

		var logout = function logout() {
			sessRepo.deleteSess();
		};

		$scope.logout = logout;

		$scope.confirmLogout = function () {
			if (window.confirm('Выйти из аккаунта?')) {
				logout();
			}
		};

		var init = function init() {
			var cbkCatch = function cbkCatch(reason) {
				alert('Ошибка авторизации');
				console.log(reason);
				return;
			};

			var cbkSuccess = function cbkSuccess() {

				$scope.sessData = sessRepo.getData();

				if ($scope.sessData.is_supplier) {
					/**
      * Href to manage, only if authed (only for masters)
      * @type {string}
      */
					$scope.href_manage = $state.href('byt.splrManager.profile', {
						supplier_id: $scope.sessData.uid
					});

					/**
      * Href to supplier info
      * @type {String}
      */
					$scope.href_supplier = $state.href('byt.splrItem.main', {
						supplier_id: $scope.sessData.uid
					});
				}
			};

			sessRepo.retrieveSess().then(cbkSuccess).catch(cbkCatch);
		};

		init();
	};

	var drct = function drct() {
		return {
			restrict: 'A',
			templateUrl: 'drct/user-status/user-status.tpl.html',
			controller: ['$scope', '$state', 'sessRepo', Xpo]
		};
	};

	angular.module('myApp.userStatusDrct', ['myApp.sessRepo']).directive('userStatusDrct', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	var xpo = function xpo($scope) {
		$scope.stateShow = {
			val: false
		};

		$scope.switchNext = function () {
			$scope.stateShow.val = true;
		};
	};

	var drct = function drct() {
		return {
			restrict: 'A', // only attribute
			templateUrl: 'drct/work-gallery/work-gallery.tpl.html',
			scope: {
				supItem: '=appSupItem',
				workScope: '=appWorkScope',
				wrapElemId: '=appWrapElemId'
			},
			controller: ['$scope', xpo]
		};
	};

	angular.module('myApp.appWorkGallery', ['myApp.appGalleryItem', 'myApp.ytbVideo']).directive('appWorkGallery', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	// any symbol, except ^"&?\/ and space

	var yidRegexp = /^[^"&?\/ ]{11}$/i;

	var drct = function drct() {
		var linkFunc = function linkFunc(scope, elems, attrs) {

			var yid = attrs.yid;
			if (!yid) {
				console.log('required: yid');
				return;
			}

			// check id format
			if (yidRegexp.test(yid) === false) {
				return;
			}

			// $scope.ytbUrl = $sce.trustAsResourceUrl();

			var fr = document.createElement("iframe");

			// || !attrs.ywidth || !attrs.yheight
			// fr.width = +attrs.ywidth;
			// fr.height = +attrs.yheight;

			fr.width = "100%";
			fr.height = "100%";
			fr.className = "full-height full-width";
			fr.src = 'https://www.youtube.com/embed/' + yid + '?html5=1';
			fr.frameBorder = 0;
			fr.scrolling = "no";
			// http://stackoverflow.com/questions/4800227/why-did-youtube-put-a-type-attribute-in-iframe-for-embedded-video
			fr.setAttribute("type", "text/html");
			fr.setAttribute("allowfullscreen", "");
			// fr.onload = function(){
			// 	console.log('onload');
			// for IE
			// http://stackoverflow.com/questions/1516803/how-to-remove-border-from-iframe-in-ie-using-javascript	 
			//fr.contentWindow.document.body.style.border="none";
			//};

			elems[0].appendChild(fr);
		};

		return {
			restrict: 'A', // only attribute
			link: linkFunc
		};
	};

	angular.module('myApp.ytbVideo', []).directive('ytbVideo', [drct]);
})(window.angular);

// <iframe class="youtube-player"
// 		type="text/html"
// 		width="200"
// 		height="200"
// 		ng-src="{{ytbUrl}}"
// 		frameborder="0">
// </iframe>
'use strict';

(function (angular, SNNS, APPCONF) {
  'use strict';

  var xpo = function xpo($q, $scope, $timeout, $state, lgr, readiness, splrLoader, splrInitiator, servTranslator, sessRepo, apimas, statePrev, q_name, q_id, q_tpe, q_hash) {

    q_tpe = q_tpe || 'tbl';

    $scope.is_map = q_tpe === 'map';

    if ($scope.is_map) {
      if (typeof window.callPhantom === 'function') {
        // before any data loading: no overflow for 2gis limits
        readiness.notFound();
        //serverError(new Error('forbiddenForCrawlers'));
        return;
      }
    }

    $scope.page_ttl = 'Мастер / салон';

    $scope.vpos = {
      val: 0
    };

    var handleEachServ = function handleEachServ(item, wrapScrollTop) {
      if (!item.is_works_once) {
        var elem = document.getElementById('serv' + item.id);
        lgr.debug('elemServ', 'position', {
          offsetTop: elem.offsetTop,
          wrapScrollTop: wrapScrollTop
        });
        if (elem && elem.offsetTop > wrapScrollTop - 51 && elem.offsetTop < wrapScrollTop + 500) {
          item.is_works_once = true;

          var isFresh = $scope.sessData.is_editor || $scope.sessData.uid === $scope.vfirm.id;

          apimas.sendGet('/work/get-by-master-and-rubric', {
            master_profile_id: $scope.vfirm.id,
            serv_rubric_id: item.serv_rubric_id,
            // usually a user watches first 5 images and makes decision
            limit: 5
          }, isFresh).then(function (r) {
            return r.arr_table_work;
          }).then(function (arr) {
            item.work_scope = {
              arr: arr
            };
          }).catch(function (err) {
            item.work_scope = {
              err: err
            };
          });
        }
      }
    };

    $scope.$watch('vpos.val', function (wrapScrollTop) {
      // newVal
      angular.forEach($scope.arr_master_serv, function (item) {
        return handleEachServ(item, wrapScrollTop);
      });
    });

    $scope.statePrev = statePrev;

    var logout = function logout() {
      sessRepo.deleteSess();
    };

    $scope.logout = logout;

    $scope.isAddToBookmarks = !!SNNS.addToBookmarks;

    $scope.addToBookmarks = function () {
      if (!$scope.isAddToBookmarks) {
        return;
      }

      SNNS.addToBookmarks();
    };

    $scope.sessData = sessRepo.getData();

    $scope.calcCitySpecHref = function (tmpMsrv, tmpCityName) {
      return $state.href('byt.aggloItem.specItem.rubricItem.tblView', {
        agglo_local_name: tmpCityName,
        spec_name: tmpMsrv.serv_group_name,
        rubric_name: tmpMsrv.serv_rubric_name
      });
    };

    var scopeSupplier = function scopeSupplier(vfirm) {
      $scope.vfirm = vfirm;
      return vfirm;
    };

    /**
     * Load master's services (only for masters from our db)
     */
    var loadServs = function loadServs(tmpTpe, tmpFirm) {
      if (tmpTpe !== 'tbl') {
        // no need load servs for map
        return $q.when([]);
      }

      // if a moder or owner master
      var isFresh = $scope.sessData.is_editor || $scope.sessData.uid === tmpFirm.id;

      return apimas.sendGet('/master/get-servs-by-master', {
        master_profile_id: tmpFirm.id,
        lang: 'ru'
      }, isFresh).then(function (response) {
        return response.arr_master_serv;
      });
    };

    var scopeServs = function scopeServs(arrMasterServ) {
      // if a error occurs - no names in array of servs
      $scope.arr_master_serv = arrMasterServ;

      $scope.$on('servListRepeatFinished', function () {
        // scroll by 1px to
        // - receive focus
        // - start to load first gallery

        $scope.vpos.val = 1;
      });

      return arrMasterServ;
    };

    var readyAll = function readyAll() {
      var dscr = $scope.vfirm.name;

      if ($scope.vfirm.city_name) {
        if ($scope.vfirm.city_name_genitive) {
          dscr += ' из ' + $scope.vfirm.city_name_genitive;
        } else {
          dscr += ' из города ' + $scope.vfirm.city_name;
        }
      }

      dscr += ' - мастер / салон красоты id' + $scope.vfirm.id;

      //var arrName = $scope.arr_master_serv.map((item) => item.serv_rubric_name);

      angular.forEach($scope.arr_master_serv, function (item, ind) {
        if (dscr.length + item.serv_rubric_name.length < 155) {
          dscr += (ind === 0 ? '. Услуги: ' : ', ') + item.serv_rubric_name[0].toLowerCase() + item.serv_rubric_name.slice(1);
        }
      });
      //          $scope.arr_master_serv = arrMasterServ;
      // `Мастер / салон красоты  - адреса, контакты, телефон, имэйл, ссылки на страницы социальных сетей, фотографии работ и список предоставляемых услуг, id${$scope.vfirm.id}`

      //<link rel="canonical" href="https://blog.example.com/dresses/green-dresses-are-awesome" />

      $scope.supplier_url = $state.href('byt.splrItem.main', {
        supplier_id: $scope.vfirm.id,
        name: $scope.vfirm.name
      });

      lgr.info('supplierURL', $scope.supplier_url);

      //id' + $scope.vfirm.id +'?name=' + encodeURIComponent($scope.vfirm.name);

      $scope.url_to_share = APPCONF.MAIN_HOST + $scope.supplier_url;

      var ttl = $scope.vfirm.name;

      if ($scope.vfirm.city_name) {
        ttl += ' - ' + $scope.vfirm.city_name;
      }

      ttl += ' - id' + $scope.vfirm.id + ' - мастер / салон красоты';

      readiness.ok(ttl, dscr, $scope.supplier_url);
    };

    var catchAll = function catchAll(response) {
      // status – {number} – HTTP status code of the response.
      // -1 executed (for phantomjs) if no connection to the endpoint
      // watch 500 errors on API side
      // response.status === -1
      if (response.status === 404) {
        $scope.err_msg = 'Мастер не найден. Возможно он был удалён модератором или самим мастером.';
        readiness.notFound();
      } else {
        $scope.err_msg = 'Возникла непредвиденная ошибка. Попробуйте позже';
        lgr.crit('splrMainCatchAll', 'unknown', {
          response: response
        });

        // send err to admin
        // show an error
        readiness.serverError(new Error(response.status));
      }
    };

    $scope.retrieveByMasterAndRubric = function (masterProfileId) {
      lgr.debug('rtrv', masterProfileId);
    };

    sessRepo.retrieveSess().then(function () {
      var isFresh = $scope.sessData.is_editor || $scope.sessData.uid === q_id;

      lgr.debug('isFresh', isFresh, {
        q_id: q_id,
        uid: $scope.sessData.uid
      });
      return splrLoader.loadSupplier(q_id, q_tpe, q_hash, isFresh);
    }).then(angular.bind(null, splrInitiator.init, q_tpe))
    // return vfirm
    .then(scopeSupplier)
    // load separatelly for a view and for a manager
    .then(angular.bind(null, loadServs, q_tpe)).then(servTranslator.translate).then(scopeServs)
    // return entire list of works
    // .then(loadWorks)
    // .then(scopeWorks)
    .then(readyAll).catch(catchAll);

    $timeout(function () {
      $scope.is_prg = true;
    }, 500);
  };

  angular.module('myApp.SplrMainController', ['myApp.appVkLike', 'myApp.appCommentForm', 'myApp.appShareBlock', 'myApp.splrContactDrct', 'myApp.splrServDrct', 'myApp.appScrollWatcher', 'myApp.appWorkGallery', 'myApp.apimas', 'myApp.sessRepo', 'myApp.readiness', 'myApp.splrLoader', 'myApp.splrInitiator', 'myApp.servTranslator', 'myApp.statePrev', 'myApp.appSplrFill']).controller('SplrMainController', ['$q', '$scope', '$timeout', '$state', 'lgr', 'readiness', 'splrLoader', 'splrInitiator', 'servTranslator', 'sessRepo', 'apimas', 'statePrev', 'q_name', 'q_id', 'q_tpe', 'q_hash', xpo]);
})(window.angular, window.snns, window.APPCONF);

//$scope.isWallPostSupplier = !!(SNNS.wallPost);

// $scope.wallPostSupplier = function(){
//   if (!$scope.isWallPostSupplier){
//     return;
//   }

//   var tmpFirm = $scope.vfirm;
//   if (!tmpFirm){
//     // if not yet loaded
//     return;
//   }

//   var wallMsg = tmpFirm.name;

//   if (tmpFirm.city_name){
//     wallMsg += ' ' + tmpFirm.city_name;
//   }

//   if ($scope.arr_master_serv){
//     var rbrNames = $scope.arr_master_serv.map(function(msrv){
//       return msrv.serv_rubric_name;
//     });
//     if (rbrNames.length > 0){
//       wallMsg += ': ' + rbrNames.join(', ');
//     }
//   }

//   SNNS.wallPost(wallMsg,
//                 APPCONF.MAIN_HOST +
//                 $scope.supplier_url +
//                 '&_escaped_fragment_=');
//   ///id" + tmpFirm.id + '?name=' + encodeURIComponent(tmpFirm.name) +
// };

// var scopeWorks = function(arrGlobalWork){
//   $scope.arr_global_work = arrGlobalWork;
// };

// param1: arrMasterServ
// var loadWorks = function(){
//   if (q_tpe !== 'tbl') {
//     // no need load servs for map
//     return $q.when([]);
//   }
//   // master_profile_id: $scope.vfirm.id
//   // return arr_serv_work: all works
//   //   usually no more than 100
//   //   bad works are removed, using a rating system: dislikes

//   // var ids = arrMasterServ.map(function(v){
//   //     return v.id;
//   // });

//   return apimas.sendGet("/work/get-by-master", {
//     master_profile_id: $scope.vfirm.id,
//     limit: 24
//   }).then(function(result){
//     return result.arr_serv_work;
//     //attachWorks(, arrMasterServ);
//   });
// };
'use strict';

(function (angular) {
	'use strict';

	var xpo = function xpo($scope, $timeout, apimas) {
		// geoRegionRepo,
		// 				 geoHelper

		// $scope.clearSupRegion = function(gggNew){
		//   gggNew.supRegion = undefined;
		// };

		// $scope.selectAll = function(tmpGeoRegionList){
		//   angular.forEach(tmpGeoRegionList, function(rgn){
		// 	rgn.is_selected = true;
		//   });
		// };

		// $scope.unselectAll = function(tmpGeoRegionList){
		//   angular.forEach(tmpGeoRegionList, function(rgn){
		// 	rgn.is_selected = false;
		//   });
		// };	

		// if (!$scope.mdr || !$scope.mdr.geo_district_id){
		//   console.log('no mdr or gid');
		//   return;
		// }

		// master_address.description cannot be changed selfly
		// only using a method from ModelToStr

		var cbkFail = function cbkFail(r) {
			switch (r.status) {
				case 422:
					alert('Ошибка ввода: ' + JSON.stringify(r.data));
					break;
				default:
					alert('Непредвиденная ошибка. Не удалось сохранить. Попробуйте позже');
			}
			console.log(r);
		};

		var cbkSuccess = function cbkSuccess(r) {
			console.log(r);
			$scope.is_saved = true;
			$timeout(function () {
				$scope.is_saved = false;
			}, 1500);
		};

		$scope.updateAddress = function (maNew, gggNew) {
			$scope.update_progress = true;
			console.log(gggNew);

			gggNew.cusRegions = [];
			//calcSlcRegionNames(tmpGeoRegionList);

			maNew.description = JSON.stringify(gggNew);

			console.log(maNew);

			apimas.sendPost('/master/upsert-address', maNew).then(cbkSuccess) // 2xx, 3xx codes
			.catch(cbkFail) // 4xx, 5xx codes
			.finally(function () {
				$scope.update_progress = false;
			});
		};

		try {
			$scope.ggg = JSON.parse($scope.mdrDescription || '{}');
		} catch (excParse) {
			console.log(excParse);
			$scope.ggg = {};
		}
	};

	var drct = function drct() {
		return {
			restrict: 'A', // only attribute
			templateUrl: 'splr-manager/address/address-edt.tpl.html',
			scope: {
				mdrDescription: '=',
				mdrGeoDistrictId: '=',
				mdr: '='
				// calc aggloItem from mdr.geo_distric_id
				//aggloItem: '=' // same as '=aggloItem'
			},
			controller: ['$scope', // non-inherited
			'$timeout', 'apimas',
			// 'geoRegionRepo',
			// 'geoHelper',
			// '$location',
			// '$mdDialog',
			// 'splrAddressHelper',
			xpo]
			// link: linkFunc
		};
	};

	angular.module('myApp.addressEdtDrct', ['myApp.apimas']).
	// 'myApp.geoRegionRepo',
	// 'myApp.geoHelper'
	directive('addressEdtDrct', [drct]);
})(window.angular);

//console.log(str);
// if (!obj){
//   console.log('no obj.sup or obj.cus');
//   result.sup = {};
//   result.cus = {};
// }
// else {
//   result.sup = {
// 	region: obj.sup.region,
// 	street: obj.sup.street,
// 	comment: obj.sup.comment
//   };

//   result.cus = {
// 	conds: obj.cus.conds
//   };
//   // result.supGeoRegionId = obj.sup.region;
//   // result.supStreet = obj.sup.street;
//   // result.supComment = obj.sup.comment;
//   // result.cusConds = obj.cus.conds;
// }
// if (!$scope.aggloItem){
//   console.log('aggloItem must be initialized in a parent view');
//   return;
// }

// if ($scope.aggloItem.id !== supplier.master_address.geo_district_id) {
//   console.log('not equal');
// }

// if (!supplier.master_address){
//   //supplier.master_address = {};
//   console.log('no master_address');
//   return;
// }

// var calcCityRegions = function(tmpGeoDistrictId){
//   return geoHelper.getRegionsByCity($scope.arr_geo_region, tmpGeoDistrictId);
// };

// $scope.calcRegList = function(tmpGeoDistrictId){
//   var cityRegions = calcCityRegions(tmpGeoDistrictId);

//   var regList = gnrtGeoRegionList(
// 	$scope.ggg.cusRegions || [],
// 	cityRegions);
//   return regList;
// };

// geoRegionRepo.retrieveData()
//   .then(function(arrGeoRegion){
// 	console.log('arrgeoregion', arrGeoRegion);
// 	$scope.arr_geo_region = arrGeoRegion;

//   });

// var gnrtGeoRegionList = function(arrCusRegionName,
// 								   arrGlbRegion){

// 	console.log('gnrtGeoRegion', arrGlbRegion);
// 	if (!arrCusRegionName){
// 	  return [];
// 	}
// 	var tmpList = [];

// 	// select regions
// 	var handleRegion = function(glbRegion){
// 	  // copy object: to use other params
// 	  var rgnObj = {
// 		id: glbRegion.id,
// 		name: glbRegion.name
// 	  };

// 	  rgnObj.is_selected =
// 	  	arrCusRegionName.indexOf(rgnObj.name) >= 0;

// 	  tmpList.push(rgnObj);
// 	};

// 	angular.forEach(arrGlbRegion, handleRegion);

// 	return tmpList;
// 	// add a property to result with selected regions
// 	// return as a separated property
// };

// var calcSlcRegionNames = function(tmpGeoRegionList){
// 	var filtered = tmpGeoRegionList.filter(function(rgn){
// 	  return rgn.is_selected === true;
// 	});

// 	return filtered.map(function(rgn){
// 	  return rgn.name;
// 	});	
// };
'use strict';

(function (angular) {
	'use strict';

	var createFilterFor = function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);
		return function (elem) {
			return elem.local_name.toLowerCase().indexOf(lowercaseQuery) >= 0;
		};
	};

	// data: {
	//   ttl: 'Адрес - редактирование',
	//   dscr: 'Редактирование адреса мастера или салона красоты: выбор города, района, указание адреса, как пройти, проехать, выбор районов работы на выезде'
	// }
	var xpo = function xpo($scope, geoRegionRepo, geoAggloRepo) {
		// geoHelper
		// $scope.supplier from a parent
		if (!$scope.supplier) {
			console.log('no $scope.supplier');
			alert('Непредвиденная ошибка');
			return;
		}

		var mdr = $scope.supplier.master_address;

		if (!mdr) {
			console.log('no master_address aggglo_edt');
			alert('Непредвиденная ошибка');
			return;
		}

		$scope.slc_data = {
			agglo_item: null,
			agglo_id: ""

			//search_text: ''
			// must be undefined to show menu by point
		};

		$scope.querySearch = function (arr, query) {
			if (!query) {
				return arr;
			}

			return arr.filter(createFilterFor(query));
		};

		$scope.onSelectedItemChange = function (tmpAggloId) {

			console.log(tmpAggloId);
			//masterAddress.geo_district_id = aggloId;

			// if not selected - ""
			if (tmpAggloId) {
				// from string to int
				mdr.geo_district_id = parseInt(tmpAggloId);
				console.log('changed', mdr);
			} else {
				mdr.geo_district_id = null;
			}

			//console.log($scope.supplier.master_address);
			// save it
			// console.log('slc_agglo');
			// console.log(tmpSlcAgglo);
			// console.log('scope slc_agglo');
			// console.log($scope.slc_data.agglo_item, tmpSlcAgglo);
		};

		// geoRegionRepo.retrieveData()
		//   .then(function(allGeoRegions){
		// 	console.log('loaded geo regions');
		// 	$scope.calcCityRegions = function(tmpGeoDistrictId){
		// 	  return geoHelper.getRegionsByCity(allGeoRegions, tmpGeoDistrictId);		
		// 	};
		//   });

		geoAggloRepo.retrieveData().then(function (arrGeoAgglo) {
			$scope.arr_geo_agglo = arrGeoAgglo;

			if (mdr.geo_district_id) {
				$scope.slc_data.agglo_id = "" + mdr.geo_district_id;
				// //$scope.slc_data.agglo_item = slcAgglo;
				// $scope.slc_data.agglo_inter_code = slcAgglo.inter_code;
				//"" + mdr.geo_district_id;
			}
		});
	};

	angular.module('myApp.SplrAggloEdtController', ['myApp.addressEdtDrct', 'myApp.geoRegionRepo', 'myApp.geoAggloRepo'
	//	'myApp.geoHelper'
	]).controller('SplrAggloEdtController', ['$scope', 'geoRegionRepo', 'geoAggloRepo',
	//	  'geoHelper',
	xpo]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	// data: {
	//   ttl: 'Имэйл - редактирование',
	//   dscr: 'Редактирование электронного адреса мастера или салона красоты'
	// }

	var xpo = function xpo($scope, $timeout, apimas) {
		// $scope.supplier;

		var cbkFail = function cbkFail(r) {
			switch (r.status) {
				case 422:
					alert('Ошибка ввода: ' + JSON.stringify(r.data));
					break;
				default:
					alert('Непредвиденная ошибка. Не удалось сохранить. Попробуйте позже');
			}
			console.log(r);
		};

		var cbkSuccess = function cbkSuccess(r) {
			console.log(r);
			$scope.is_saved = true;
			$timeout(function () {
				$scope.is_saved = false;
			}, 1500);
		};

		$scope.updateEmail = function (objNew) {
			$scope.update_progress = true;

			apimas.sendPost('/master/update-email', objNew).then(cbkSuccess) // 2xx, 3xx codes
			.catch(cbkFail) // 4xx, 5xx codes
			.finally(function () {
				$scope.update_progress = false;
			});
		};
	};

	var drct = function drct() {
		return {
			restrict: 'A',
			scope: {
				supplier: '='
			},
			templateUrl: 'splr-manager/email/email-edt.tpl.html',
			controller: ['$scope', '$timeout', 'apimas', xpo]
		};
	};

	angular.module('myApp.splrEmailEdt', ['myApp.apimas']).directive('splrEmailEdt', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	// data: {
	//   ttl: 'Телефон - редактирование',
	//   dscr: 'Редактирование номера телефона мастера или салона красоты'
	// }

	var xpo = function xpo($scope, $timeout, apimas) {

		var cbkFail = function cbkFail(r) {
			switch (r.status) {
				case 422:
					var dtl = r.data.details;

					if (dtl) {
						if (r.data.errkey === 'validationError' && dtl.property === 'main_phone') {
							alert('Неправильный формат: используйте +7xxxzzzzzzz');
							break;
						}

						if (r.data.errkey === 'duplicateKeyError' && dtl.property === 'main_phone') {
							alert('Мастер или салон с таким номеров уже зарегистрирован в системе. Попробуйте указать другой номер.');
							break;
						}
					}

					alert('Ошибка ввода: ' + JSON.stringify(r.data));
					break;
				default:
					alert('Непредвиденная ошибка. Не удалось сохранить. Попробуйте позже');
			}
			console.log(r);
		};

		var cbkSuccess = function cbkSuccess(r) {
			console.log(r);
			$scope.is_saved = true;
			$timeout(function () {
				$scope.is_saved = false;
			}, 1500);
		};

		$scope.updatePhone = function (objNew) {
			// TODO: define country and check format of mobile phone

			$scope.update_progress = true;

			apimas.sendPost('/master/update-phone', objNew).then(cbkSuccess) // 2xx, 3xx codes
			.catch(cbkFail) // 4xx, 5xx codes
			.finally(function () {
				$scope.update_progress = false;
			});
		};
	};

	var drct = function drct() {
		return {
			restrict: 'A',
			scope: {
				supplier: '='
			},
			templateUrl: 'splr-manager/phone/phone-edt.tpl.html',
			controller: ['$scope', '$timeout', 'apimas', xpo]
		};
	};

	angular.module('myApp.splrPhoneEdt', ['myApp.apimas']).directive('splrPhoneEdt', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	// ttl: 'Профиль - редактирование',
	// dscr: 'Редактирование профиля мастера или салона красоты: наименование, биография, описание, опыт работы и т.п.'

	var xpo = function xpo($scope, $timeout, apimas) {

		// $scope.supplier from a parent view	

		var cbkFail = function cbkFail(r) {
			$scope.update_progress = false;
			switch (r.status) {
				case 422:
					alert('Ошибка ввода: ' + JSON.stringify(r.data));
					break;
				default:
					alert('Непредвиденная ошибка. Не удалось сохранить. Попробуйте позже');
			}
			console.log(r);
		};

		var cbkSuccess = function cbkSuccess(r) {
			$scope.update_progress = false;
			$scope.is_saved = true;
			$timeout(function () {
				$scope.is_saved = false;
			}, 1500);
			console.log(r);
		};

		$scope.updateProfile = function (profileNew) {
			$scope.update_progress = true;
			console.log(profileNew);
			apimas.sendPost('/master/update-profile', profileNew).then(cbkSuccess) // 2xx, 3xx codes
			.catch(cbkFail); // 4xx, 5xx codes
		};
	};

	angular.module('myApp.SplrProfileEdtController', ['myApp.apimas']).controller('SplrProfileEdtController', ['$scope', '$timeout', 'apimas', xpo]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	// data: {
	//   ttl: 'Аккаунт - удаление',
	//   dscr: 'Удаление аккаунта мастера или салона красоты: удаление всех связанных данных и выход из системы'
	// }

	var xpo = function xpo($scope, $state, sessRepo, apimas) {

		var cbkSuccess = function cbkSuccess() {
			console.log('sessRepoData', sessRepo.getData());
			if (!sessRepo.getData().is_editor) {
				// do not exit if a moderator
				// exit if a master or salon
				sessRepo.deleteSess();
			}
			// do not exit if a moder
			$scope.is_progress = false;
			$state.go('byt.welcome');
		};

		var cbkFail = function cbkFail(reason) {
			$scope.is_progress = false;
			console.log(reason);
			$scope.err_msg = 'Непредвиденная ошибка: не удалось удалить. Попробуйте позже';
		};

		$scope.removeAccount = function (tmpSupplier) {
			$scope.err_msg = null;
			console.log('removed', tmpSupplier);
			$scope.is_progress = true;
			apimas.sendPost("/master/delete-master", {
				id: tmpSupplier.id
			}).then(cbkSuccess).catch(cbkFail);

			// clean a session
			// redirect to main page
		};
	};

	angular.module('myApp.SplrRemovalController', ['myApp.sessRepo']).controller('SplrRemovalController', ['$scope', '$state', 'sessRepo', 'apimas', xpo]);
})(window.angular);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
	'use strict';

	var Xpo = function Xpo($scope, $q, $state, apimas, servGroupRepo) {
		_classCallCheck(this, Xpo);

		$scope.isFree = function (criteria) {
			if ($scope.arr_master_serv) {
				return $scope.arr_master_serv.filter(function (item) {
					return item.serv_rubric_id === criteria.id;
				}).length === 0;
			}
			return true;
		};

		$scope.arr_ids = [];
		$scope.handleChange = function (isChecked, rbrId) {
			if (isChecked) {
				$scope.arr_ids.push(rbrId);
			} else {
				var ind = $scope.arr_ids.indexOf(rbrId);
				if (ind >= 0) {
					$scope.arr_ids.splice(ind, 1);
				}
			}
			console.log($scope.arr_ids);
		};

		var ins = function ins(arrIds, ind) {
			if (arrIds[ind]) {

				return apimas.sendPost('/master/upsert-serv', {
					master_profile_id: $scope.supplier.id,
					serv_rubric_id: arrIds[ind],
					is_out: false // required field
				}).then(function () {
					return ins(arrIds, ind + 1);
				});
			} else {
				return $q.when();
			}
		};

		$scope.addServs = function (arrIds) {
			if (arrIds.length === 0) {
				return;
			}
			$scope.err_insert = null;
			$scope.is_progress = true;
			// run iteration
			ins(arrIds, 0).then(function () {
				$scope.is_progress = false;
				$state.go('byt.splrManager.servList', {
					supplier_id: $scope.supplier.id
				});
			}).catch(function (err) {
				$scope.err_insert = err;
				$scope.is_progress = false;
			});
		};

		// need to retrieve all existing rubrics
		apimas.sendGet("/master/get-servs-by-master", {
			master_profile_id: $scope.supplier.id,
			lang: 'ru'
		}, true).then(function (response) {
			$scope.arr_master_serv = response.arr_master_serv;
			console.log('servs', $scope.arr_master_serv);
		}).then(function () {
			return servGroupRepo.retrieveWithRubrics();
		}).then(function (arr) {
			console.log('with  rubrics', arr);
			$scope.arr_serv_group = arr;
		}).catch(function (err) {
			$scope.err_master_serv = err;
		});
	};

	var drct = function drct() {
		return {
			restrict: 'A',
			scope: {
				supplier: '='
			},
			templateUrl: 'splr-manager/serv-creator/serv-creator-edt.tpl.html',
			controller: ['$scope', '$q', '$state', 'apimas', 'servGroupRepo', Xpo]
		};
	};

	angular.module('myApp.servCreatorEdt', ['myApp.apimas', 'myApp.servGroupRepo']).directive('servCreatorEdt', [drct]);
})(window.angular);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
	'use strict';

	var Xpo = function Xpo($scope, $state, $timeout, apimas, q_id) {
		_classCallCheck(this, Xpo);

		// console.log('serv', q_id);

		// console.log($scope.supplier.arr_master_serv.filter(item => item.id === q_id));

		var deleteWorkRubrics = function deleteWorkRubrics(masterProfileId, servRubricId) {
			// delete from work_rubric wr
			// inner join serv_work sw
			// where wr.serv_rubric_id = $1
			// and sw.master_profile_id = $2

			// delete from serv_work
			// where master_profile_id = $1
			// and count(work_rubric) === 0
			// remove works without work_rubrics
			return apimas.sendPost('/work/delete-by-master-and-rubric', {
				master_profile_id: masterProfileId,
				serv_rubric_id: servRubricId
			});
		};

		$scope.deleteServ = function (tmpServ) {
			if (window.confirm('При удалении услуги удаляются также все соответствующие данные, в том числе фотографии, привязанные к услуге')) {
				// если у работы нет никаких привязанных рубрик - то удалять

				apimas.sendPost('/master/delete-serv', {
					id: tmpServ.id,
					master_profile_id: tmpServ.master_profile_id
				}).then(function () {
					return deleteWorkRubrics(tmpServ.master_profile_id, tmpServ.serv_rubric_id);
				}).then(function () {
					$state.go('byt.splrManager.servList', {
						supplier_id: tmpServ.master_profile_id
					});
				}).catch(function (err) {
					alert('Возникла непредвиденная ошибка. Повторите позже или обратитесь в техподдержку.');
					console.log(err);
				});
			}
		};

		var catchUpdate = function catchUpdate(err) {
			$scope.update_progress = false;
			if (err.status === 422) {
				$scope.err_update = 'Ошибка данных: попробуйте указать другие данные';
				return;
			}

			$scope.err_update = 'Непредвиденная ошибка: повторите запрос позже';
		};

		var handleUpdate = function handleUpdate() {
			$scope.update_progress = false;
			console.log('success');

			$scope.is_saved = true;
			$timeout(function () {
				$scope.is_saved = false;
			}, 1500);
		};

		$scope.updateMsrv = function (tmpMsrv) {
			if ($scope.update_progress) {
				return;
			}
			$scope.err_update = null;
			console.log('update', tmpMsrv);
			$scope.update_progress = true;
			apimas.sendPost('/master/upsert-serv', tmpMsrv).then(handleUpdate).catch(catchUpdate);
		};

		var catchServ = function catchServ(err) {
			var msg = '';
			if (err.status === 404) {
				msg = 'Услуга #' + q_id + ' не найдена.';
			} else {
				msg = 'Непредвиденная ошибка. Попробуйте позже.';
			}

			$scope.err_msrv = {
				status: err.status,
				msg: msg
			};
		};

		// load works + work_rubrics
		var loadWorks = function loadWorks() {
			$scope.arr_serv_work = [];
		};

		apimas.sendGet('/master/get-serv', {
			id: +q_id,
			lang: 'ru'
		}, true).then(function (r) {
			return $scope.msrv = r;
		}).then(loadWorks).catch(catchServ);
	};

	angular.module('myApp.SplrServItemEdtController', ['myApp.apimas']).controller('SplrServItemEdtController', ['$scope', '$state', '$timeout', 'apimas', 'q_id', Xpo]);
})(window.angular);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
	'use strict';

	// data: {
	//   ttl: 'Услуги - редактирование',
	//   dscr: 'Редактирование услуг и работ мастера или салона красоты: экспорт из соотвествующего аккаунта'
	// }

	var Xpo = function Xpo($scope, apimas) {
		_classCallCheck(this, Xpo);

		return apimas.sendGet("/master/get-servs-by-master", {
			master_profile_id: $scope.supplier.id,
			lang: 'ru'
		}, true).then(function (response) {
			$scope.arr_master_serv = response.arr_master_serv.sort(function (a, b) {
				if (a.serv_rubric_name > b.serv_rubric_name) {
					return 1;
				} else {
					return -1;
				}
			});
			console.log($scope.arr_master_serv);
		}).catch(function (err) {
			$scope.err_master_serv = err;
		});
	};

	angular.module('myApp.SplrServListEdtController', ['myApp.apimas']).controller('SplrServListEdtController', ['$scope', 'apimas', Xpo]);
})(window.angular);
"use strict";

(function (angular) {
	'use strict';

	// data: {
	//   ttl: 'Соцконтакты - редактирование',
	//   dscr: 'Редактирование контактов мастера или салона красоты: ссылки в социальных сетях и на личные сайты, контакты популярных мессенджеров: скайп, вибер, вотсап'
	// }

	var xpo = function xpo($scope, $timeout, apimas) {

		var handleDuplicate = function handleDuplicate(constraint) {
			if (constraint.indexOf("uq_master_profile__") !== 0) {
				return null;
			}
			//"uq_master_profile__facebook"
			var socialStr = constraint.replace("uq_master_profile__", "");
			if (socialStr === 'landline') {
				return 'стационарный телефон';
			}
			return socialStr;
		};

		var handleCheckViolation = function handleCheckViolation(constraint) {
			if (constraint.indexOf("bw_master_profile__") !== 0) {
				return null;
			}
			var socialStr = constraint.replace("bw_master_profile__", "");
			if (socialStr === 'landline') {
				return 'стационарный телефон';
			}
			return socialStr;
		};

		var cbkFail = function cbkFail(r) {
			switch (r.status) {
				case 422:
					var dta = r.data;
					if (dta.errkey === "duplicateKeyError") {
						if (dta.details && dta.details.property) {
							var fieldDupl = handleDuplicate(dta.details.property);
							if (fieldDupl) {
								alert("Ошибка ввода: указанное значение поля \"" + fieldDupl + "\" уже занято: попробуйте указать другое либо оставьте поле пустым");
								return;
							}
						}
					}

					if (dta.errkey === "validationError") {
						if (dta.details && dta.details.property) {
							var fieldCheck = handleCheckViolation(dta.details.property);
							if (fieldCheck) {
								alert("Ошибка ввода: неверный формат значения \"" + fieldCheck + "\": попробуйте указать другое либо оставьте поле пустым");
								return;
							}
						}
					}

					alert('Ошибка ввода: ' + JSON.stringify(dta));
					break;
				default:
					alert('Непредвиденная ошибка. Не удалось сохранить. Попробуйте позже');
			}
			console.log(r);
		};

		var cbkSuccess = function cbkSuccess(r) {
			console.log(r);
			$scope.is_saved = true;
			$timeout(function () {
				$scope.is_saved = false;
			}, 1500);
		};

		$scope.updateProfile = function (prf) {
			$scope.update_progress = true;
			console.log(prf);

			apimas.sendPost('/master/update-profile', prf).then(cbkSuccess) // 2xx, 3xx codes
			.catch(cbkFail) // 4xx, 5xx codes
			.finally(function () {
				$scope.update_progress = false;
			});
		};

		// $scope.supplier.vkontakte  =	$scope.supplier.vkontakte || 'https://vk.com/';
	};

	angular.module('myApp.SplrSocialEdtController', ['myApp.apimas']).controller('SplrSocialEdtController', ['$scope', '$timeout', 'apimas', xpo]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	// http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric/1830844#1830844

	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	var xpo = function xpo($scope, $timeout, apimas) {

		var cbkFail = function cbkFail(r) {
			switch (r.status) {
				case 422:
					var dtl = r.data.details;

					if (dtl) {
						if (r.data.errkey === 'validationError' && dtl.vk_id) {
							alert('Неверный формат идентификатора');
							break;
						}

						if (r.data.errkey === 'duplicateKeyError') {
							alert('Мастер или салон с таким ID уже зарегистрирован в системе. Попробуйте указать другой ID.');
							break;
						}
					}

					alert('Ошибка данных: ' + JSON.stringify(r.data));
					break;
				default:
					alert('Непредвиденная ошибка: не удалось сохранить - попробуйте позже');
			}
			console.log(r);
		};

		var cbkSuccess = function cbkSuccess(r) {
			console.log(r);
			$scope.is_saved = true;
			$timeout(function () {
				$scope.is_saved = false;
			}, 1500);
		};

		$scope.updateVkid = function (masterProfileId, vkId) {
			if (!vkId) {
				alert('Ошибка: необходимо указать идентификатор');
				return;
			}

			if (isNumeric(vkId) === false) {
				alert('Ошибка: необходимо указать число');
				return;
			}

			// convert to number
			vkId = +vkId;

			$scope.update_progress = true;

			apimas.sendPost('/master/update-vk-id', {
				id: masterProfileId,
				vk_id: vkId
			}).then(cbkSuccess) // 2xx, 3xx codes
			.catch(cbkFail) // 4xx, 5xx codes
			.finally(function () {
				$scope.update_progress = false;
			});
		};
	};

	var drct = function drct() {
		return {
			restrict: 'A',
			scope: {
				supplier: '='
			},
			templateUrl: 'splr-manager/vkid/vkid-edt.tpl.html',
			controller: ['$scope', '$timeout', 'apimas', xpo]
		};
	};

	angular.module('myApp.splrVkidEdt', ['myApp.apimas']).directive('splrVkidEdt', [drct]);
})(window.angular);
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
	'use strict';

	var ytbRegexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

	var Xpo = function Xpo($scope, apimas) {
		_classCallCheck(this, Xpo);

		var catchInsertYtb = function catchInsertYtb(err) {
			if (err.status === 422) {
				var dta = err.data;
				if (dta) {
					if (dta.errkey === "duplicateKeyError") {
						if (dta.details && dta.details.property === "uq_serv_work__main_video") {
							alert("Данное видео уже было добавлено ранее вами или другим мастером: попробуйте указать другое видео.");
							return;
						}
					}

					if (dta.errkey === "validationError") {
						if (dta.details && dta.details.property === "main_video") {
							alert("Неверный формат ссылки на видео: попробуйте указать другое видео.");
							return;
						}
					}
				}
			}

			console.log(err);
			alert('Возникла непредвиденная ошибка при добавлении: попробуйте позже или укажите другое видео');
		};

		$scope.addVideoLink = function () {
			var lnk = window.prompt("Ссылка на Youtube видео, где представлена ваша услуга " + $scope.servRubricName, "https://www.youtube.com/watch?v=");

			// cancel (null) or empty
			if (!lnk) {
				return;
			}

			var result = lnk.match(ytbRegexp);
			console.log(result);

			if (!result || !result[1]) {
				alert('На данный момент поддерживаются только видео из Youtube: укажите корректную ссылку к видео');
				return;
			}

			var yid = result[1];

			console.log(yid);

			apimas.sendPost("/work/insert-item-with-ytb", {
				master_profile_id: $scope.masterProfileId,
				serv_rubric_id: $scope.servRubricId,
				main_video: yid
			}).then(function (createdWork) {
				// tableWork instance
				// {
				//   id: 10000000,
				//   main_video: yid,
				//   created: 1458956866,
				//   master_profile_id: $scope.masterProfileId,
				//   side_link: null,
				//   main_img: null,
				//   preview_img: null
				// }
				$scope.arrServWork.unshift(createdWork);
			}).catch(catchInsertYtb);
		};

		// upload on file select or drop
		var uploadFile = function uploadFile(tmpFiles) {
			var ind = tmpFiles.length - 1;

			var file = tmpFiles[ind];
			if (!file) {
				$scope.progress = null;
				return;
			}
			// start from 5 percents
			$scope.progress = 5;

			// console.log('uploading...', file);
			apimas.sendMultipart('/work/insert-item-with-file?master_profile_id=' + $scope.masterProfileId + '&serv_rubric_id=' + $scope.servRubricId, file).then(function (resp) {
				//console.log('Success', resp);
				console.log(resp.config.data.ufile.name + ' uploaded.');
				var createdWork = resp.data;
				// add to beginning
				$scope.arrServWork.unshift(createdWork);
				//console.log('Response: ', resp.data);
				// remove uploaded file
				tmpFiles.splice(ind, 1);
				// upload the next file
				uploadFile(tmpFiles);
			}, function (resp) {
				console.log('Error status: ' + resp.status);
				$scope.progress = null;
				alert('Ошибка загрузки: попробуйте повторить позже или выберите другой файл');
			}, function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				$scope.progress = progressPercentage;
				// console.log('progress: ' +  + '% ');
				// console.log('evt', evt);
				// evt.config.data.file.name);
			});
		};

		$scope.removePreFile = function (tmpFiles, ind) {
			tmpFiles.splice(ind, 1);
		};

		$scope.submit = function (tmpForm, tmpFiles) {
			console.log('submitting...', tmpForm, tmpFiles);
			if (!tmpForm.$valid) {
				console.log('error', tmpForm.$error, tmpForm);
				// continue: other files may be valid
			}

			if (!tmpFiles || tmpFiles.length === 0) {
				console.log('no files selected');
				return;
			}

			// start uploading from first file
			uploadFile(tmpFiles);
		};
		//  $q, $state, apimas
		// nothing to load

		// $scope.addPhoto = function(attrs){
		// 	// upload a photo to the server
		// 	// create a link to a photo
		// 	// - use url like API. work/123/photo
		// 	// if successfully
		// 	// create a work with work_rubric (in one procedure)

		// 	console.log('addPhoto', attrs);
		// };

		// $scope.uploadFile = function(ev){
		// 	var files = ev.target.files;
		// 	console.log('files', files);

		// };

		// $scope.addVideoLink = function(mainVideoLink){
		// 	console.log('mainVideoLink', mainVideoLink);
		// };
	};

	var drct = function drct() {
		return {
			restrict: 'A',
			scope: {
				masterProfileId: '=',
				servRubricId: '=',
				servRubricName: '=',
				// todo: separate it: list from item
				arrServWork: '='
			},
			templateUrl: 'splr-manager/work-creator/work-creator-edt.tpl.html',
			controller: ['$scope', 'apimas',
			// '$q',
			// '$state',
			Xpo]
		};
	};

	angular.module('myApp.workCreatorEdt', ['myApp.apimas',
	// for directives
	'ngFileUpload']).directive('workCreatorEdt', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	// class Xpo{
	// 	constructor($scope, $sce){
	// 	}
	// }

	// actually it is a work_rubric (with serv_work inside)

	var drct = function drct() {

		var linkFunc = function linkFunc(scope, elems) {
			var raw = elems[0];

			//console.log('lf', raw.offsetTop);

			scope.$watch('vpos.val', function (wrapScrollTop) {
				if (!scope.is_show) {
					// console.log('vpos', wrapScrollTop);
					if (raw.offsetTop > wrapScrollTop - 500 && raw.offsetTop < wrapScrollTop + 1000) {
						// show (load) image
						scope.is_show = true;
					}
				}
				//console.log('newpos', wrapScrollTop, raw.offsetTop);
			});
		};

		return {
			restrict: 'A',
			scope: {
				servWork: '=',
				vpos: '='
			},
			templateUrl: 'splr-manager/work-item/work-item-edt.tpl.html',
			// controller: [
			// 	'$scope',
			// 	'$sce',
			// 	Xpo
			// ],
			link: linkFunc
		};
	};

	angular.module('myApp.workItemEdt', [
	// 'myApp.apimas'
	'myApp.ytbVideo']).directive('workItemEdt', [drct]);
})(window.angular);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
	'use strict';

	var Xpo = function Xpo($scope, $state, apimas) {
		_classCallCheck(this, Xpo);

		var catchDel = function catchDel(err) {
			console.log(err);
			// $scope.err_obj = {
			//   msg: ''
			// };
			alert('Возникла непредвиденная ошибка в процессе удаления. Повторите позже либо обратитесь к администратору.');
		};

		var handleDel = function handleDel(r) {
			console.log('removed handleDel', r);

			var arr = $scope.arr_serv_work;
			for (var i = arr.length - 1; i >= 0; i -= 1) {
				if (arr[i].id === r.serv_work_id) {
					arr.splice(i, 1);
				}
			}

			// delete it from array: or update an array or images
		};

		$scope.deleteServWork = function (tmpServWorkId, tmpServRubricId) {
			if (window.confirm('Удаление работы (фото или видео) невозвратно. Действительно удалить?')) {
				//console.log('delete', servWorkId);
				// todo: add method to API
				apimas.sendPost('/work/delete-by-work-and-rubric', {
					serv_work_id: tmpServWorkId,
					serv_rubric_id: tmpServRubricId
				}).then(handleDel).catch(catchDel);
			}
		};

		// $scope.$watch('vpos.val', function(wrapScrollTop){		
		// 	console.log('newpos', wrapScrollTop);
		// });

		apimas.sendGet('/work/get-by-master-and-rubric', {
			master_profile_id: $scope.masterProfileId,
			serv_rubric_id: $scope.servRubricId,
			limit: 20
			// nstg allows load max 20 at one time
			// to show other images: user must remove previous
			// or add a button: load more images (next 20)
			// only if limit = count
		}, true).then(function (r) {
			return $scope.arr_serv_work = r.arr_table_work;
		});
	};

	var drct = function drct() {
		return {
			restrict: 'A',
			scope: {
				masterProfileId: '=',
				servRubricId: '=',
				servRubricName: '=',
				vpos: '=',
				canDelete: '=',
				canInsert: '='
			},
			templateUrl: 'splr-manager/work-list/work-list-edt.tpl.html',
			controller: ['$scope', '$state', 'apimas', Xpo]
		};
	};

	angular.module('myApp.workListEdt', ['myApp.apimas']).directive('workListEdt', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	var drct = function drct() {
		return {
			restrict: 'A',
			templateUrl: 'agglo-item/spec-item/rubric-item/blog-links.tpl.html',
			scope: {
				rubricArticles: '='
			}
		};
	};

	angular.module('myApp.appBlogLinks', []).directive('appBlogLinks', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	// class Xpo{
	// 	constructor($scope){

	// 	}
	// }

	var drct = function drct() {
		return {
			restrict: 'A',
			templateUrl: 'agglo-item/spec-item/rubric-item/outer-links.tpl.html',
			scope: {
				curAgglo: '=',
				curSpec: '=',
				curRubric: '='
			}
			// controller: [
			// 	'$scope',
			// 	Xpo
			// ]
		};
	};

	angular.module('myApp.appOuterLinks', []).directive('appOuterLinks', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	var xpo = function xpo($scope, $timeout, $q, $state, readiness, servGroupRepo, servStatRepo, blogRepo, rubricHelper, q_rubric_name) {

		// from parent view
		// $scope.cur_spec must be
		// $scope.cur_agglo

		var handleServStat = function handleServStat(r) {
			// r
			// $scope.arr_serv_group = r.arr_serv_group;
			// load child views

			// this property is independent of rubric_arr
			// and may be retrieved using own request: /rubrics/:name

			var curServRubric = r.arr_serv_rubric_stat.filter(function (rbr) {
				return rbr.name === q_rubric_name;
			})[0];

			if (!curServRubric) {
				$scope.err_cur_rubric = {
					msg: 'Мастера и салоны красоты, предоставляющие услугу "' + q_rubric_name + '" в городе ' + $scope.cur_agglo.local_name + ' не найдены'
				};

				readiness.notFound();
				return;
			} else {

				//similarRubrics

				$scope.similar_rubrics = rubricHelper.calcSimilarRubrics(r.arr_serv_rubric_stat, curServRubric);

				$scope.rubric_articles = blogRepo.calcByRubricId(curServRubric.id);

				$scope.cur_rubric = curServRubric;
				// readiness - in nested views

				// var similar =

				// angular.forEach(similar, (item) => {
				// 	console.log(item.weight, item.item.name);
				// });
				// console.log('similar', similar);
			}
		};

		var catchServStat = function catchServStat(reason) {
			$scope.err_cur_rubric = {
				msg: 'Ошибка загрузки услуги. Пожалуйста, попробуйте позже',
				reason: reason
			};

			console.log('retrieveData', reason);
			readiness.serverError(new Error(reason));
		};

		/**
   * Selected rubric with id like hairExt, hairCut
   * @type {Object}
   * serv_rubric: {}
   */
		servGroupRepo.retrieveData().then(function (arrServGroup) {
			servStatRepo.retrieveData($scope.cur_agglo.id, arrServGroup).then(handleServStat).catch(catchServStat);
		});

		// todo: select rubric after redirection
		//       add to search field

		$timeout(function () {
			$scope.is_prg = true;
		}, 500);
	};

	angular.module('myApp.RubricItemController', ['myApp.drct', 'myApp.appSimilarLinks', 'myApp.appOuterLinks', 'myApp.appBlogLinks', 'myApp.servGroupRepo', 'myApp.servStatRepo', 'myApp.blogRepo', 'myApp.rubricHelper',
	//	'myApp.hprFactory',
	'myApp.readiness']).controller('RubricItemController', ['$scope', '$timeout', '$q', '$state', 'readiness', 'servGroupRepo', 'servStatRepo', 'blogRepo', 'rubricHelper', 'q_rubric_name', xpo]);
})(window.angular);
'use strict';

(function (angular) {
  'use strict';

  // class Xpo{
  // 	constructor($scope){

  // 	}
  // }

  var drct = function drct() {
    return {
      restrict: 'A',
      templateUrl: 'agglo-item/spec-item/rubric-item/similar-links.tpl.html',
      scope: {
        similarRubrics: '=',
        curAgglo: '='
      }
    };
  };

  angular.module('myApp.appSimilarLinks', []).directive('appSimilarLinks', [drct]);
})(window.angular);
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (angular) {
	'use strict';

	var Xpo = function Xpo($scope, $timeout, $state, servGroupRepo, servStatRepo, readiness) {
		_classCallCheck(this, Xpo);

		$scope.home_href = $state.href("byt.aggloItem.specList", {
			agglo_local_name: $scope.agglo.local_name
		});

		$scope.map_href = $state.href("byt.map", {
			g: $scope.agglo.local_name,
			spec: $scope.spec.id
		});

		$scope.calcHref = function (rubricName, viewKind) {
			return $state.href("byt.aggloItem.specItem.rubricItem." + viewKind, {
				agglo_local_name: $scope.agglo.local_name,
				spec_name: $scope.spec.name,
				rubric_name: rubricName
			});
		};

		var handleReady = function handleReady() {
			var canonicalUrl = $state.href("byt.aggloItem.specItem.rubricList", {
				agglo_local_name: $scope.agglo.local_name,
				spec_name: $scope.spec.name
			});

			var pageDscr = $scope.spec.name + ' в ' + $scope.agglo.case_prepositional + ' - перечень предоставляемых услуг';

			var dscrLength = pageDscr.length;
			var dscrPluses = [];
			angular.forEach($scope.rubrics, function (rbr) {
				if (dscrLength + rbr.name.length + 2 <= 140) {
					dscrLength = dscrLength + rbr.name.length + 2;
					dscrPluses.push(rbr.name);
				}
			});

			if (dscrPluses.length > 0) {
				pageDscr += ': ' + dscrPluses.join(', ');
			}

			readiness.ok($scope.spec.name + ' - ' + $scope.agglo.local_name + ' - услуги мастеров и салонов красоты', pageDscr, canonicalUrl);
		};

		var handleServStat = function handleServStat(r) {
			$scope.allRubrics = r.arr_serv_rubric_stat;

			var rubrics = [];
			if ($scope.allRubrics) {
				angular.forEach($scope.allRubrics, function (rbr) {
					if (rbr.serv_group_id === $scope.spec.id) {
						rubrics.push(rbr);
					}
				});
			}

			//  | orderBy: '-count_master_serv'
			rubrics.sort(function (a, b) {
				// desc
				if (a.count_master_serv < b.count_master_serv) {
					return 1;
				} else {
					return -1;
				}
			});

			// for dynamic update - use watch instead
			// $scope.$watch('allRubrics', function(arr){
			// }, true);
			$scope.rubrics = rubrics;
		};

		var catchServStat = function catchServStat(reason) {
			$scope.err_rubrics = {
				msg: 'Ошибка загрузки категорий. Пожалуйста, попробуйте позже',
				reason: reason
			};

			console.log(reason);
			readiness.serverError(new Error(reason));
		};

		servGroupRepo.retrieveData().then(function (arrServGroup) {

			servStatRepo.retrieveData($scope.agglo.id, arrServGroup).then(handleServStat).then(handleReady).catch(catchServStat);
		});

		$timeout(function () {
			$scope.is_prg = true;
		}, 500);
	};

	var drct = function drct() {
		return {
			restrict: 'A',
			scope: {
				agglo: '=',
				spec: '='
			},
			templateUrl: 'agglo-item/spec-item/rubric-list/rubric-list.tpl.html',
			controller: ['$scope', '$timeout', '$state', 'servGroupRepo', 'servStatRepo', 'readiness', Xpo]
		};
	};

	angular.module('myApp.rubricListDrct', ['myApp.servGroupRepo', 'myApp.servStatRepo', 'myApp.readiness']).directive('rubricListDrct', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	var xpo = function xpo(servGroupRepo) {

		// add translation to array
		var translate = function translate(arr_master_serv) {

			var successLoadGroups = function successLoadGroups(arr_serv_group) {
				//var rubricNameObj = {};
				var groupNameObj = {};

				angular.forEach(arr_serv_group, function (grp) {
					//angular.forEach(grp.arr_serv_rubric, function(rbr){
					// rubricNameObj[rbr.id] = rbr.name;
					groupNameObj[grp.id] = grp.name;
					// });
				});

				angular.forEach(arr_master_serv, function (msrv) {
					// from a request
					// msrv.serv_rubric_name = capitalizeFirst(msrv.serv_rubric_name);
					// 	rubricNameObj[msrv.serv_rubric_id];
					msrv.serv_group_name = groupNameObj[msrv.serv_group_id];
				});

				// return translated array
				return arr_master_serv;
			};

			// load all rubrics with names
			// loaded already - if from a catalog of masters
			// non-loaded - if from search engine or direct (update)
			return servGroupRepo.retrieveData().then(successLoadGroups);
		};

		return {
			translate: translate
		};
	};

	angular.module('myApp.servTranslator', ['myApp.servGroupRepo']).factory('servTranslator', ['servGroupRepo', xpo]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	var xpo = function xpo($q, aggloItemRepo, splrAddressHelper) {
		var initSupplier = function initSupplier(q_tpe, tmpSupplier) {

			var cnv = {
				map: function map(frm) {
					var obj = {
						id: frm.id, //TODO check existence
						name: frm.name,
						username: frm.name,
						city_name: frm.city_name,
						address: frm.address,
						contacts: [],
						// ads_article: frm.article,
						// ads_ref: frm.link, // object with {link, text}
						// ads_warning: frm.fas_warning, // warning for ads
						avatar: null, // no such field
						bio: null,
						is_company: true,
						lon: frm.lon,
						lat: frm.lat
					};

					// 2d to 1dimension
					angular.forEach(frm.contacts, function (ctctGroup) {
						angular.forEach(ctctGroup.contacts, function (ctct) {
							//ctct.alias = ctct.text;
							obj.contacts.push(ctct);
						});
					});

					return obj;
				},
				tbl: function tbl(frm) {
					var obj = {
						id: frm.id,
						name: frm.name,
						username: frm.username,
						contacts: [],
						ads_article: null,
						ads_ref: null, // ads reference in article (ads)
						ads_warning: null, // warning for ads
						avatar: frm.avatar,
						bio: frm.bio,
						is_company: frm.is_company,
						lon: null,
						lat: null
					};

					//       for aggloItem, splrItem controllers
					//       or load with splrItem request
					if (frm.master_address) {
						aggloItemRepo.retrieveById(frm.master_address.geo_district_id).then(function (tmpAggloItem) {
							//console.log('tmpAggloItem', tmpAggloItem);
							if (tmpAggloItem) {
								obj.city_name = tmpAggloItem.local_name;
								obj.city_name_prepositional = tmpAggloItem.case_prepositional;
								obj.city_name_genitive = tmpAggloItem.case_genitive;
							} else {
								console.log('no city name for ' + frm.master_address);
							}
						});

						if (frm.master_address.description) {
							obj.address = splrAddressHelper.calcAddrFromDescription(frm.master_address.description);
							obj.address_comment = splrAddressHelper.calcCommentFromDescription(frm.master_address.description);
							obj.out_geo = splrAddressHelper.calcOutGeoFromDescription(frm.master_address.description);
						}

						//console.log(obj.city_name);
					}

					if (frm.main_phone) {
						obj.contacts.push({
							type: 'phone',
							value: frm.main_phone,
							alias: null,
							comment: ''
						});
					}

					if (frm.landline) {
						obj.contacts.push({
							type: 'landline',
							value: frm.landline,
							alias: null,
							comment: ''
						});
					}

					if (frm.main_email) {
						// email
						obj.contacts.push({
							type: 'email',
							value: frm.main_email,
							alias: null,
							comment: ''
						});
					}

					var socials = ['whatsapp', 'viber', 'twitter', 'skype'];

					var sites = ['website', 'vkontakte', 'facebook', 'odnoklassniki'];

					var fixLink = function fixLink(tmpLink) {
						if (!tmpLink) {
							return tmpLink;
						}

						if (tmpLink.indexOf('http://') !== 0 && tmpLink.indexOf('https://') !== 0) {
							return 'https://' + tmpLink;
						}

						return tmpLink;
					};

					angular.forEach(socials, function (social) {
						if (frm[social]) {
							// if (social === 'skype'){
							// 	obj.contacts.push({
							// 	  type: social,
							// 	  // for href
							// 	  value: 'skype:' + frm[social] + '?call',
							// 	  // to show it
							// 	  alias: frm[social],				
							// 	  comment: ''
							// 	});
							// } else {			 
							obj.contacts.push({
								type: social,
								// for href
								value: frm[social],
								// to show it
								alias: frm[social],
								comment: ''
							});
						}
						//}
					});

					angular.forEach(sites, function (site) {
						if (frm[site]) {
							obj.contacts.push({
								type: site,
								value: fixLink(frm[site]),
								alias: frm[site].replace('http://', '').replace('https://', ''),
								comment: ''
							});
						}
					});

					// if (frm.website){
					//   obj.contacts.push({
					// 	type: "website",
					// 	value: frm.website,
					// 	alias: frm.website,
					// 	comment: ''
					//   });
					// }

					// if (frm.whatsapp){
					//   obj.contacts.push({
					// 	type: "whatsapp",
					// 	value: frm.whatsapp,
					// 	alias: '',
					// 	comment: ''
					//   });
					// }

					// get username concat
					if (frm.nstg_id) {
						obj.contacts.push({
							type: "instagram",
							value: "https://www.instagram.com/_u/" + frm.username + '/',
							alias: "instagram.com/" + frm.username + '/',
							comment: ''
						});
					}

					if (frm.vk_id) {
						obj.contacts.push({
							type: "vkprofile",
							value: "https://vk.com/id" + frm.vk_id,
							alias: "vk.com/id" + frm.vk_id,
							comment: ''
						});
					}

					return obj;
				}
			};

			if (!cnv[q_tpe]) {
				return $q.reject({
					status: 500,
					msg: q_tpe + 'isNotAllowed'
				});
			} else {
				return $q.when(cnv[q_tpe](tmpSupplier));
			}
		};

		return {
			init: initSupplier
		};
	};

	angular.module('myApp.splrInitiator', ['myApp.aggloItemRepo', 'myApp.splrAddressHelper']).factory('splrInitiator', ['$q', 'aggloItemRepo', 'splrAddressHelper', xpo]);
})(window.angular);

// 	var obj =  {
// 	  id: frm.id,
// 	  name: frm.name || frm.username,
// 	  city_name: null, // no city name for previous portfolio
// 	  address: null,
// 	  contacts: [],
// 	  ads_article: null,
// 	  ads_ref: null, // ads reference in article (ads)
// 	  ads_warning: null, // warning for ads
// 	  avatar: frm.avatar,
// 	  bio: frm.bio,
// 	  lon: null,
// 	  lat: null
// 	};

// 	var instalink = 'https://instagram.com/' + frm.username;
// 	// insta
// 	obj.contacts.push({
// 	  type: 'instagram',
// 	  value: instalink,
// 	  alias: instalink,
// 	  comment: ''
// 	});

// 	// website
// 	obj.contacts.push({
// 	  type: 'website',
// 	  value: frm.website,
// 	  alias: frm.website,
// 	  comment: ''
// 	});

// 	return obj;
// }
'use strict';

(function (angular) {
	'use strict';

	var xpo = function xpo($q, firmItemRepo, apimas) {

		var loadSupplier = function loadSupplier(q_id, q_tpe, q_hash, isFreshMaster) {

			var defineMaster = function defineMaster() {
				switch (q_tpe) {
					case 'map':
						// do not load data for phantom (crawlers) requests
						if (typeof window.callPhantom === 'function') {
							// before any data loading: no overflow for 2gis limits	
							return $q.reject({
								msg: 'Данные карты не загружаются по запросам поисковых роботов',
								dtl: 'window.callPhantom is not allowed'
							});
						} else {
							return firmItemRepo.retrieveData(q_id, q_hash);
						}
						break;
					// .then(cbkResult)
					// .catch(cbkCatch);
					default:
						return apimas.sendGet('/master/get-profile', {
							id: q_id
						}, isFreshMaster);
				}
			};

			return defineMaster();

			// return tmpSupplier

			// handle catch in initiator
			// catch - response.data | status
		};

		return {
			loadSupplier: loadSupplier
		};
	};

	angular.module('myApp.splrLoader', ['myApp.firmItemRepo', 'myApp.apimas']).factory('splrLoader', ['$q', 'firmItemRepo', 'apimas', xpo]);
})(window.angular);

// short variant of $scope.supplier
// $scope.splr
// .contactInfo
// .privateInfo
// .detailInfo
// .servs

//   id: q_id,
//   tpe: q_tpe,
//   hash: q_hash

// var cbkResult = function(tmpSupplier){
// 	if (!tmpSupplier){
// 	  return $q.reject({
// 		msg: 'Мастер / салон не найден. Возможно страница была удалена.',
// 		dtl: 'no tmpSupplier'
// 	  });

// 	} else {
// 	  return $q.when(tmpSupplier);
// 	  //next(null, tmpSupplier);
// 	  //$scope.supplier = tmpSupplier;
// 	  //console.log('supplier loaded: ' + tmpSupplier.name);
// 	}
// };

// var cbkCatch = function(response){
// 	var msg = '';
// 	if (response.status === 404) {
// 	  msg = ''
// 	}
// 	// no need to close a dialog and open new
// 	// just write in current dialog
// 	// a user will close it after reading a error
// 	return $q.reject({
// 	  msg:'Возникла непредвиденная ошибка. Повторите запрос позже.',
// 	  dtl: response
// 	});
// };
'use strict';

(function (angular) {
	'use strict';

	var drct = function drct() {
		return {
			restrict: 'A',
			scope: {
				ctct: '='
			},
			templateUrl: 'splr/main/splr-contact/splr-contact.tpl.html'
		};
	};

	angular.module('myApp.splrContactDrct', []).directive('splrContactDrct', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	var drct = function drct() {
		return {
			restrict: 'A',
			scope: {
				msrv: '=',
				citySpecHref: '=',
				isEditable: '='
			},
			templateUrl: 'splr/main/splr-serv/splr-serv.tpl.html'
		};
	};

	angular.module('myApp.splrServDrct', []).directive('splrServDrct', [drct]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	var xpo = function xpo($scope, $location, $state) {

		$scope.saveHash = function (hashString) {
			$location.hash(hashString);
		};

		var linkOpts = {
			supplier_id: $scope.pw.master_profile_id,
			name: $scope.pw.master_profile_name
		};

		$scope.workInfoLink = $state.href('byt.mediaItem', {
			//supplier_id: $scope.pw.master_profile_id,
			//serv_rubric_name: $scope.rubricName,
			media_id: $scope.pw.id
			//name: $scope.pw.master_profile_name
		});

		$scope.masterInfoLink = $state.href('byt.splrItem.main', linkOpts);
	};

	var drct = function drct() {

		return {
			restrict: 'A', // only attribute
			templateUrl: 'agglo-item/spec-item/rubric-item/prtf-view/prtf-item.tpl.html',
			scope: {
				pw: '=', // same as '=pw'
				rubricName: '=' // rubric-name tag
			},
			controller: ['$scope', '$location', '$state', xpo]
		};
	};

	angular.module('myApp.prtfItemDrct', ['myApp.ytbVideo']).directive('prtfItemDrct', [drct]);
})(window.angular);

// var linkFunc = function(scope, elems, attrs){
//   // first 8 records
//   if (attrs.index <= 7) {
// 	// todo: попробовать: показывать айтэм
// 	//   по событию display:block, а не по изменению скопа
// 	scope.is_viewed = true;
// 	return;
//   }

// scrollRepo.addListener(attrs.index, function(){
// 	if (hprFactory.isElemInViewport(elems[0], 200)){
// 	  scrollRepo.removeListener(attrs.index);
// 	  scope.is_viewed = true;
// 	  //console.log('removed listen', attrs.index, pos);
// 	}
// 	// delete from listeners, after image loading
// });
//};
'use strict';

// TODO: show photos for search engines
//       after switching to our masters
(function (angular) {
	'use strict';

	var init = function init($scope, $state, $location, prtfRepo, next) {

		$scope.rview_id = 'prtf';
		$scope.rview_name = 'Фото';
		// load data for phantom (crawlers) requests:
		// there are 4 photos pre-rendered only + links to masters
		// if (typeof window.callPhantom === 'function') {
		//   // before any data loading: no overflow for nstg limits
		//   next();
		//   return;
		// }

		var tmpPageHeader = 'Фото';

		if ($scope.cur_rubric.case_gen) {
			tmpPageHeader += ' ' + $scope.cur_rubric.case_gen;
		} else {
			tmpPageHeader += ' ' + $scope.cur_rubric.name;
		}

		if ($scope.cur_agglo.case_prepositional) {
			tmpPageHeader += ' в ' + $scope.cur_agglo.case_prepositional;
		} else {
			tmpPageHeader += ' ' + $scope.cur_agglo.local_name;
		}

		$scope.page_header = tmpPageHeader;

		$scope.vpos = {
			val: 0
		};

		$scope.$watch('vpos.val', function (wrapScrollTop) {
			// console.log("posval", wrapScrollTop);

			angular.forEach($scope.arr_prtf_work, function (item) {
				if (!item.is_show) {
					var elem = document.getElementById('work' + item.id);

					if (elem && elem.offsetTop > wrapScrollTop - 250 && elem.offsetTop < wrapScrollTop + 800) {
						// show item content
						item.is_show = true;
					}
				}
			});
		});

		var cbkError = function cbkError(reason) {
			next({
				msg: 'Ошибка загрузки фотографий. Попробуйте позже.',
				dtl: reason
			});
		};

		var cbkSuccess = function cbkSuccess(arrPrtfWork) {
			next(null, arrPrtfWork);
		};

		prtfRepo.retrieveData($scope.cur_rubric.id, $scope.cur_agglo.id).then(cbkSuccess).catch(cbkError);
	};

	var xpo = function xpo($scope, $state, $location, readiness, prtfRepo) {

		// parent
		// cur_agglo
		// cur_spec
		// cur_rubric

		init($scope, $state, $location, prtfRepo, function (err, arrPrtfWork) {
			if (err) {
				$scope.err_arr_prtf_work = err;
				// console.log(JSON.stringify(err));
				readiness.serverError();
				return;
			}

			var readyAll = function readyAll() {
				var canonicalUrl = $state.href("byt.aggloItem.specItem.rubricItem.prtfView", {
					agglo_local_name: $scope.cur_agglo.local_name,
					spec_name: $scope.cur_spec.name,
					rubric_name: $scope.cur_rubric.name
				});

				var itemCount = $scope.arr_prtf_work.length;
				var foundStr = '';
				if (itemCount) {
					foundStr = ' (' + itemCount + 'шт.)';
				}

				var rubricStr = '';

				if ($scope.cur_rubric.case_gen) {
					rubricStr = ' ' + $scope.cur_rubric.case_gen;
				} else {
					rubricStr = ' по услуге ' + $scope.cur_rubric.name;
				}

				readiness.ok('Фото' + foundStr + ' - ' + $scope.cur_rubric.name + ' - ' + $scope.cur_agglo.local_name + ' - 2016 год', 'Фотографии' + foundStr + rubricStr + ' в ' + $scope.cur_agglo.case_prepositional + ': красивые фото в хорошем качестве, 2015-2016 год, модные тенденции, дизайнерские решения', canonicalUrl);
			};

			var calcElemPos = function calcElemPos(hsh) {
				if (hsh) {
					var elem = document.getElementById('work' + hsh);

					if (elem) {
						var offs = elem.offsetTop;

						if (offs) {
							// -50 center it: cut top and bottom elements
							//   to see main element in centre
							return offs - 50;
						}
					}
				}
				// some padding to execute scroll (for first elements)
				return 1;
			};

			// next: servListRepeatFinished
			// when arr_prtf_work is attached - this event is started
			$scope.$on('servListRepeatFinished', function () {
				// event
				// this event is not fired when no list items
				//console.log('servListRepeatFinished');

				//console.log('ngRf', e);
				//you also get the actual event object
				//do stuff, execute functions -- whatever...
				$scope.vpos.val = calcElemPos($location.hash());

				readyAll();
			});

			/**
   * Attach repo data to this value
   *   Lancer repo updated every time, when a user changes
   *   slc_arr_serv_rubric, selecting or unselecting
   *   rubrics (from left menu)
   */
			$scope.arr_prtf_work = arrPrtfWork;

			if (arrPrtfWork.length === 0) {
				readyAll();
			}
		});
	};

	angular.module('myApp.PrtfViewController', ['myApp.drct', 'myApp.prtfRepo', 'myApp.appScrollWatcher', 'myApp.prtfItemDrct', 'myApp.readiness']).controller('PrtfViewController', ['$scope', '$state', '$location', 'readiness', 'prtfRepo', xpo]);
})(window.angular);
'use strict';

(function (angular) {
	'use strict';

	// use browser cache instead to return after master info

	var xpo = function xpo($scope, $state, $location, $q, readiness, apimas, supListRepo, splrAddressHelper, sessRepo) {

		$scope.rview_id = 'tbl';
		$scope.rview_name = 'Каталог';

		var tmpPageHeader = '';

		if ($scope.cur_rubric.case_dat) {
			tmpPageHeader = 'Мастера по ' + $scope.cur_rubric.case_dat;
		} else {
			tmpPageHeader = $scope.cur_rubric.name;
		}

		if ($scope.cur_agglo.case_prepositional) {
			tmpPageHeader += ' в ' + $scope.cur_agglo.case_prepositional;
		} else {
			tmpPageHeader += ' ' + $scope.cur_agglo.local_name;
		}

		// {{cur_rubric.name}} в {{cur_agglo.case_prepositional}}: мастера и салоны красоты
		$scope.page_header = tmpPageHeader;

		// data from parent scopes
		// $scope.cur_agglo
		// $scope.cur_spec
		// $scope.cur_rubric

		// do not clean previous data:
		//   show new data instead previous
		//   hide previous if not loaded yet

		//var rubrId = $scope.cur_rubric.id;
		//var specId = $scope.cur_spec.id;	

		$scope.vpos = {
			val: 0
		};

		$scope.$watch('vpos.val', function (wrapScrollTop) {
			// newVal
			//console.log('newVal', wrapScrollTop);
			angular.forEach($scope.arr_supplier, function (item) {
				if (!item.is_works_once) {
					// todo: optimize - build elem tree before
					var elem = document.getElementById('supplier' + item.id);
					// alternative: use newPos to calculate this condition
					//if isElemInViewport(elem, 500)){
					//console.log('elem', elem.offsetTop, wrapScrollTop);
					if (elem && elem.offsetTop > wrapScrollTop - 101 && elem.offsetTop < wrapScrollTop + 900) {
						// try to load once per supItem
						// it assigned before results of a query
						//   to skip the same concurrent requests
						item.is_works_once = true;

						apimas.sendGet("/work/get-by-master-and-rubric", {
							master_profile_id: item.id,
							serv_rubric_id: $scope.cur_rubric.id,
							// usually a user watches first 5 images and makes decision
							limit: 5
						}).then(function (r) {
							return r.arr_table_work;
						}).then(function (arr) {
							console.log('arr_table_work', item.id, arr);
							item.work_scope = {
								arr: arr
							};
						}).catch(function (err) {
							console.log('err_table_work', item.id, err);
							item.work_scope = {
								err: err
							};
						});
						// retrieveWorks(item.id, rubricId);
						// attach works to supItem
						// show gallery
						// if error - attach error to supItem			
					}
				}
			});
		});

		var cbkFail = function cbkFail(tmpErr) {
			$scope.err_msg = 'Ошибка загрузки мастеров и салонов. Попробуйте позже';
			readiness.serverError(tmpErr);
		};

		var readyAll = function readyAll() {
			var canonicalUrl = $state.href("byt.aggloItem.specItem.rubricItem.tblView", {
				agglo_local_name: $scope.cur_agglo.local_name,
				spec_name: $scope.cur_spec.name,
				rubric_name: $scope.cur_rubric.name
			});

			var supLength = $scope.arr_supplier.length;

			var rubricStr;

			if ($scope.cur_rubric.case_dat) {
				rubricStr = ' по ' + $scope.cur_rubric.case_dat;
			} else {
				rubricStr = ', предоставляющие услугу ' + $scope.cur_rubric.name;
			}

			var pageDscr = 'Избранные мастера и салоны красоты' + rubricStr + ' из ' + $scope.cur_agglo.case_genitive + ': найдено ' + supLength + ' - контакты, фотографии работ, профили в соцсетях';

			readiness.ok($scope.cur_rubric.name + ' - ' + $scope.cur_agglo.local_name + ' - мастера и салоны красоты - найдено ' + supLength, pageDscr, canonicalUrl);
		};

		// $scope.checkData = {
		//   isBioHided: false
		// };

		// | filter: bioFilter as filteredList
		// $scope.bioFilter = function (item) {
		//   if ($scope.checkData.isBioHided) {
		// 	// hide all records with bio (filled already)
		// 	return !item.bio;
		//   } else {
		// 	// show all by default
		// 	return true;
		//   }
		// };

		$scope.sessData = sessRepo.getData();

		// todo: move to server side
		var attachGeo = function attachGeo(arrSupplier) {
			angular.forEach(arrSupplier, function (item) {
				// console.log('supItem', item);
				if (item.master_address) {
					// item.master_address.geo_district_id

					var dscr = item.master_address.description;
					if (dscr) {
						item.sup_geo = splrAddressHelper.calcAddrFromDescription(dscr);
						item.cus_geo = splrAddressHelper.calcOutGeoFromDescription(dscr);

						if (!item.sup_geo && !item.cus_geo) {
							console.log('dscr parsing problem', item.id, item.name, dscr);
						}
					}
				}
			});
		};

		var calcElemPos = function calcElemPos(hsh) {
			if (hsh) {
				var elem = document.getElementById('supplier' + hsh);

				if (elem) {
					var offs = elem.offsetTop;

					if (offs) {
						// center it: cut top and bottom elements
						//   to see main element in centre
						return offs - 4; // + 50;
						// minus margin to show full card with border
					}
				}
			}
			// some padding to execute scroll (for first elements)
			return 1;
		};

		var handleResult = function handleResult(arrSupplier) {
			attachGeo(arrSupplier);

			// similar articles
			var dfr = $q.defer();
			$scope.$on('supplierListRepeatFinished', function () {
				// event
				//console.log('servListRepeatFinished');
				// if no items: this event may be not fired

				//console.log('ngRf', e);
				//you also get the actual event object
				//do stuff, execute functions -- whatever...
				//console.log('hashId', hsh);
				$scope.vpos.val = calcElemPos($location.hash());

				dfr.resolve();
			});

			$scope.arr_supplier = arrSupplier;

			if ($scope.arr_supplier.length === 0) {
				dfr.resolve();
			}

			return dfr.promise;
		};

		// var calcFitPosts = function(){
		//   postRepo.retrieveListByRubric($scope.cur_rubric.name)
		// 	.then(function(data){
		// 	  console.log('fit articles');
		// 	  console.log(data);
		// 	  //$scope.fit_articles = arrArticle;
		// 	})
		// 	.catch(function(err){
		// 	  // skip err
		// 	  // todo: send to admin
		// 	  console.log(err);
		// 	});

		// };

		// retrieve 99 masters by a specific rubric
		supListRepo.retrieveByRubric($scope.cur_rubric.id, $scope.cur_agglo.id, '', 99).then(handleResult)
		//	  .then(calcFitPosts)
		.then(readyAll).catch(cbkFail);
	};

	angular.module('myApp.TblViewController', ['myApp.appTblItem', 'myApp.appScrollWatcher', 'myApp.appWorkGallery', 'myApp.supListRepo', 'myApp.splrAddressHelper', 'myApp.sessRepo', 'myApp.readiness', 'myApp.apimas']).controller('TblViewController', ['$scope', '$state', '$location', '$q', 'readiness', 'apimas', 'supListRepo', 'splrAddressHelper', 'sessRepo', xpo]);
})(window.angular);

// run all listeners
// for (var objKey in $scope.listeners){
// 	$scope.listeners[objKey](newPos);
// }
"use strict";

angular.module("myApp.templateFactory", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("app.tpl.html", "<div class=\"full-height\" ui-view=\"appContent\" role=\"main\"></div>");
  $templateCache.put("agglo-item/agglo-item.tpl.html", "<div class=\"full-height\" data-ng-if=\"cur_agglo\" data-ui-view=\"aggloItemContent\"></div><div ng-if=\"is_prg\"><div ng-if=\"!cur_agglo && !err_cur_agglo\"><div class=\"pdng text-center\">загрузка локации...</div></div></div><div ng-if=\"err_cur_agglo\"><div class=\"err-msg\" ng-bind=\"err_cur_agglo.msg\"></div><div class=\"err-alt\"><a ui-sref=\"byt.welcome\">Перейти на главную страницу</a></div></div>");
  $templateCache.put("agglo-list/agglo-list-drct.tpl.html", "<div class=\"agglo-list\"><div class=\"agglo-list__search-box\"><input type=\"text\" placeholder=\"Введите название города\" autofocus ng-model=\"agglo_search.local_name\"></div><ul class=\"agglo-list pure-g\"><li class=\"agglo-list__item pure-u-1 pure-u-sm-1-4\" ng-repeat=\"agg in arrGeoAgglo | filter:agglo_search | limitTo: 8\"><a class=\"agglo-list__link agglo-list__link-bold\" ng-bind=\"agg.local_name\" ng-href=\"{{calcAggloHref(agg.local_name)}}\"></a></li></ul><div style=\"border-top: 1px dashed #aaa; padding: 1px\"></div><div class=\"pure-g\"><div class=\"pure-u-1 pure-u-sm-1-4\"><ul><li class=\"agglo-list__item\" ng-repeat=\"agg in arrGeoAgglo | filter:agglo_search | limitTo: 22:8\"><a class=\"agglo-list__link\" ng-bind=\"agg.local_name\" ui-sref=\"byt.aggloItem.specList({agglo_local_name:agg.local_name})\"></a></li></ul></div><div class=\"pure-u-1 pure-u-sm-1-4\"><ul class=\"agglo-list\"><li class=\"agglo-list__item\" ng-repeat=\"agg in arrGeoAgglo | filter:agglo_search | limitTo:22:30\"><a class=\"agglo-list__link\" ng-bind=\"agg.local_name\" ui-sref=\"byt.aggloItem.specList({agglo_local_name:agg.local_name})\"></a></li></ul></div><div class=\"pure-u-1 pure-u-sm-1-4\"><ul class=\"agglo-list\"><li class=\"agglo-list__item\" ng-repeat=\"agg in arrGeoAgglo | filter:agglo_search | limitTo:22:52\"><a class=\"agglo-list__link\" ng-bind=\"agg.local_name\" ui-sref=\"byt.aggloItem.specList({agglo_local_name:agg.local_name})\"></a></li></ul></div><div class=\"pure-u-1 pure-u-sm-1-4\"><ul class=\"agglo-list\"><li class=\"agglo-list__item\" ng-repeat=\"agg in arrGeoAgglo | filter:agglo_search | limitTo:22:74\"><a class=\"agglo-list__link\" ng-bind=\"agg.local_name\" ui-sref=\"byt.aggloItem.specList({agglo_local_name:agg.local_name})\"></a></li></ul></div></div></div>");
  $templateCache.put("agglo-list/agglo-list.tpl.html", "<div data-app-toolbar></div><div class=\"app-content\"><h1 class=\"page-header\">Выбор города</h1><div ng-if=\"arr_geo_agglo\"><div data-agglo-list-drct data-arr-geo-agglo=\"arr_geo_agglo\"></div></div><div ng-if=\"agglo_err\"><div class=\"err-msg\" ng-bind=\"agglo_err.msg\"></div><div class=\"err-alt\"><a ui-sref=\"byt.welcome\">Перейти на главную страницу</a></div></div></div>");
  $templateCache.put("app-map/app-map.tpl.html", "<div data-app-toolbar></div><div class=\"app-content\"><div class=\"full-height\" ng-if=\"q_spec\"><div class=\"full-height\" ng-if=\"startLng && startLat && startZoom\"><div lfl-map class=\"my-map custom-popup\" data-start-lng=\"{{startLng}}\" data-start-lat=\"{{startLat}}\" data-start-zoom=\"{{startZoom}}\" data-map-move=\"mapMove\" data-map-markers=\"mapMarkers\"></div></div><div class=\"pdng text-center\" ng-if=\"!startLng && !startLat && !startZoom && !errMap\">загрузка карты...</div><div class=\"err-msg\" ng-if=\"errMap\">{{errMap.msg}}</div></div><div ng-if=\"!q_spec && arr_serv_group\" class=\"pdng text-center\"><div class=\"pdng mrgn\">Укажите рубрику</div><ul><li class=\"pdng\" ng-repeat=\"grp in arr_serv_group\"><a ui-sref=\"byt.map({spec: grp.id})\">{{grp.name}}</a></li></ul></div></div>");
  $templateCache.put("drct/breadcrumb.tpl.html", "<nav><ol class=\"breadcrumb\" itemscope itemtype=\"http://schema.org/BreadcrumbList\"><li class=\"breadcrumb__item-wrap\" itemprop=\"itemListElement\" itemscope itemtype=\"http://schema.org/ListItem\"><a class=\"breadcrumb__item breadcrumb__item-first breadcrumb__act\" data-ng-href=\"{{hrefHome}}\" itemprop=\"item\"><span class=\"fa fa-home breadcrumb__icon\" itemprop=\"name\" content=\"МисКра\"></span></a><meta itemprop=\"position\" content=\"1\"></li><li class=\"breadcrumb__item-wrap\" ng-if=\"aggloName\" itemprop=\"itemListElement\" itemscope itemtype=\"http://schema.org/ListItem\"><a class=\"breadcrumb__item\" data-ng-href=\"{{calcHrefAgglo(aggloName)}}\" itemprop=\"item\"><span ng-bind=\"aggloName\" itemprop=\"name\"></span></a><meta itemprop=\"position\" content=\"2\"></li><li class=\"breadcrumb__item-wrap\" ng-if=\"splrName\" itemprop=\"itemListElement\" itemscope itemtype=\"http://schema.org/ListItem\"><a class=\"breadcrumb__item\" data-ng-href=\"{{calcHrefSplr(splrId, splrName)}}\" itemprop=\"item\"><span ng-bind=\"splrName\" itemprop=\"name\"></span></a><meta itemprop=\"position\" content=\"3\"></li><li class=\"breadcrumb__item-wrap\" ng-if=\"specName\" itemprop=\"itemListElement\" itemscope itemtype=\"http://schema.org/ListItem\"><a class=\"breadcrumb__item\" data-ng-href=\"{{calcHrefSpec(aggloName, specName)}}\" itemprop=\"item\"><span ng-bind=\"specName\" itemprop=\"name\"></span></a><meta itemprop=\"position\" content=\"3\"></li><li class=\"breadcrumb__item-wrap\" ng-if=\"rubricName\" itemprop=\"itemListElement\" itemscope itemtype=\"http://schema.org/ListItem\"><a class=\"breadcrumb__item\" data-ng-href=\"{{calcHrefRubric(aggloName, specName, rubricName, rviewId)}}\" itemprop=\"item\"><span itemprop=\"name\">{{rubricName}}: {{rviewName}}</span></a><meta itemprop=\"position\" content=\"4\"></li></ol></nav>");
  $templateCache.put("drct/left-link.tpl.html", "<div ng-if=\"is_show\"><span style=\"cursor:pointer; color: blue\" ng-click=\"showLeftLinkBox()\" analytics-on=\"click\" analytics-category=\"leftlink\" analytics-event=\"leftlink-on\">&#171; выводить ссылку на приложение в меню слева</span></div>");
  $templateCache.put("media-item/media-item.tpl.html", "<div class=\"work-item\" ng-if=\"sw\"><div class=\"full-height\" ng-if=\"sw.main_img\"><div class=\"work-item__img-wrap\" data-full-size-img data-img-src=\"{{sw.main_img}}\" data-work-id=\"{{sw.id}}\" ng-click=\"is_full=!is_full\"></div></div><div class=\"full-height\" ng-if=\"sw.main_video\"><div ytb-video class=\"work-item__video-wrap\" data-yid=\"{{sw.main_video}}\"></div></div><div class=\"abs-top\"><div class=\"work-item__top-wrap\" ng-show=\"!is_full\"><div class=\"work-item__back-link-wrap\"><button class=\"work-item__back-link empty-button\" title=\"назад\" onclick=\"history.back()\"><span class=\"fa fa-arrow-left\"></span></button></div><div class=\"work-item__splr-link-wrap\"><h1 class=\"work-item__header\"><span ng-if=\"sw.main_serv_rubric\">{{sw.main_serv_rubric.name}} </span>&copy;<a class=\"work-item__splr-link\" ng-if=\"link_supplier\" ng-href=\"{{link_supplier}}\"> {{sw.master_profile_name}}</a></h1></div></div></div><div ng-if=\"sw.arr_serv_rubric && sw.arr_serv_rubric.length\"><div class=\"work-item__dscr-wrap\" ng-show=\"!is_full\"><span class=\"work-item__dscr\"><span ng-repeat=\"rbr in sw.arr_serv_rubric\"><a class=\"work-item__dscr-tag-link\" title=\"Все мастера и салоны красоты по услуге {{rbr.name}} в городе {{sw.city_name}}\" ng-href=\"{{calcHrefRubric(sw.city_name, rbr.serv_group_id, rbr.name)}}\" ng-if=\"sw.city_name\">{{rbr.name}} </a><span class=\"work-item__dscr-tag\" ng-if=\"!sw.city_name\">{{rbr.name}}</span></span></span></div></div><div class=\"work-item__soc-wrap\" ng-if=\"url_to_share && sw.main_serv_rubric && sw.main_img\" ng-show=\"!is_full\"><div class=\"work-item__button-wrap\"><div app-vk-like data-subject-url=\"{{url_to_share}}\" data-subject-id=\"media{{sw.id}}\" data-page-title=\"{{sw.main_serv_rubric.name}}\" data-page-description=\"{{sw.master_profile_name}}\" data-page-image=\"{{sw.preview_img}}\" analytics-on=\"click\" analytics-category=\"workitem\" analytics-event=\"likework\"></div></div></div></div><div ng-if=\"err_msg\"><div class=\"err-msg\" ng-bind=\"err_msg\"></div><div class=\"err-alt\"><a ui-sref=\"byt.welcome\">Перейти на главную страницу</a></div></div>");
  $templateCache.put("quiz-item/qres-item.tpl.html", "<div ng-if=\"qresItem\"><div class=\"mrgn quiz__qres-item\"><img ng-src=\"{{image_share}}\" alt=\"{{qresItem.best}} - {{qresItem.worst}}\"></div><div class=\"text-center\" ng-if=\"isWallPostQres\"><button class=\"app-button\" ng-click=\"wallPostQres(qresItem)\" analytics-on analytics-category=\"share\" analytics-event=\"share-qres\">Сохранить на стену</button></div><div class=\"text-center\" ng-if=\"!isWallPostQres\"><div app-share-block data-title=\"Тест: {{quizItem.ttl}}\" data-permalink=\"{{url_share}}\" data-page-image=\"{{image_share}}\"></div></div></div>");
  $templateCache.put("quiz-item/qstn-item.tpl.html", "<h2 class=\"pdng qstn-ttl\">{{item.ttl}}</h2><ul class=\"pdng qstn-list\"><li class=\"qstn-list__item-wrap\" data-ng-repeat=\"answ in item.answer_list\"><span class=\"qstn-list__item-link\" data-ng-click=\"setAnswer(item, answ)\" analytics-on analytics-category=\"quiz\" analytics-event=\"{{answ.id}}\">{{answ.ttl}} <span class=\"qstn-list__item-checked\" ng-if=\"item.user_answer === answ\"><i class=\"fa fa-check-circle\"></i></span></span></li></ul>");
  $templateCache.put("quiz-item/qstn-list.tpl.html", "<div><h1 class=\"pdng\">{{quizItem.ttl}}</h1><p class=\"pdng\" ng-bind=\"quizItem.dscr\"></p><div ng-repeat=\"qu in quizItem.question_list\"><div data-qstn-item-drct data-item=\"qu\"></div></div><div class=\"pdng\"><div><button class=\"app-button full-width\" data-ng-disabled=\"calcAnswerIds(quizItem).length !== quizItem.question_list.length\" data-ng-click=\"calcResult(quizItem)\">Показать результат</button></div><div class=\"text-center\"><span>ответов: {{calcAnswerIds(quizItem).length}} из {{quizItem.question_list.length}}</span></div></div><div ng-if=\"qresItem\"><div qres-item-drct data-qres-item=\"qresItem\" data-quiz-item=\"quizItem\"></div></div><div class=\"pdng\"><div app-comment-form data-subject-id=\"quiz{{quizItem.id}}\" data-subject-url=\"{{url_to_share}}\"></div></div><div data-ng-if=\"err\">{{err}}</div><div class=\"mrgn text-center\"><a ui-sref=\"byt.welcome\">Вернуться на главную</a></div></div>");
  $templateCache.put("quiz-item/quiz-item.tpl.html", "<div data-app-toolbar></div><div class=\"app-content\"><div class=\"quiz-wrap\"><div ng-if=\"quizItem\"><div ui-view=\"quizContent\"></div></div><div ng-if=\"!quizItem && !quizErr\"><div class=\"mrgn text-center\">загрузка теста...</div></div><div ng-if=\"quizErr\"><div class=\"err-msg\" ng-bind=\"quizErr\"></div></div></div></div>");
  $templateCache.put("splr/splr-item.tpl.html", "<div class=\"full-height\"><div ng-if=\"splr\" class=\"full-height\"><div ui-view=\"splrItemContent\" class=\"full-height fade\"></div></div></div>");
  $templateCache.put("splr-login/oauth-callback.tpl.html", "<div>идёт авторизация...</div>");
  $templateCache.put("splr-login/oauth-login.tpl.html", "<div data-app-toolbar></div><div class=\"app-content\"><div class=\"oauth-login\"><h1 class=\"header\" data-ng-bind=\"page_ttl\"></h1><div class=\"pdng\"><div class=\"provider-wrap\"><div app-login-email></div></div><div class=\"provider-wrap\"><div class=\"mrgn text-center\">либо войдите с помощью</div><button class=\"app-button button-vk\" ng-click=\"openOauthVkn()\" analytics-on analytics-category=\"login\" analytics-event=\"login-vkn\"><span class=\"fa fa-vk fa-lg\"></span> Вконтакте</button><div><small>необходим аккаунт мастера либо администратора салона красоты</small></div></div></div><div class=\"pdng text-center\"><a ui-sref=\"byt.welcome\">на главную</a></div></div><div data-app-footer></div></div>");
  $templateCache.put("splr-login/splr-login.tpl.html", "<div data-app-toolbar></div><div class=\"app-content\"><div class=\"pure-g\"><div class=\"pure-u pure-u-sm-1-8\"></div><div class=\"pure-u-1 pure-u-sm-3-4\"><div class=\"mrgn\"><h1 data-ng-bind=\"page_ttl\"></h1><form class=\"splr-login__form\" name=\"loginForm\" ng-submit=\"sendAuth(auth.lgn, auth.pwd)\"><div class=\"splr-login__form-item\"><label>Логин <input class=\"splr-login__input\" autofocus type=\"text\" name=\"lgn\" maxlength=\"10\" minlength=\"1\" required ng-model=\"auth.lgn\"></label><div class=\"splr-login__warning\" role=\"alert\" ng-messages=\"loginForm.lgn.$error\"><div ng-message=\"required\" ng-if=\"loginForm.lgn.$error.required && loginForm.lgn.$dirty\">обязательное поле: от 1 до 10 цифр</div><div ng-message=\"minlength\" ng-if=\"loginForm.lgn.$error.minlength\">обязательное поле: от 1 до 10 цифр</div><div ng-message=\"maxlength\" ng-if=\"loginForm.lgn.$error.maxlength\">обязательное поле: от 1 до 10 цифр</div></div></div><div class=\"splr-login__form-item\"><label>Пароль <input class=\"splr-login__input\" type=\"password\" name=\"pwd\" required maxlength=\"50\" minlength=\"6\" ng-model=\"auth.pwd\"></label><div class=\"splr-login__warning\" role=\"alert\" ng-messages=\"loginForm.pwd.$error\"><div ng-message=\"minlength\" ng-if=\"loginForm.pwd.$error.minlength\">обязательное поле: от 6 до 50 символов</div><div ng-message=\"maxlength\" ng-if=\"loginForm.pwd.$error.maxlength\">обязательное поле: от 6 до 50 символов</div><div ng-message=\"required\" ng-if=\"loginForm.pwd.$error.required && loginForm.pwd.$dirty\">обязательное поле: от 6 до 50 символов</div></div></div><div><button class=\"splr-login__lgn-button\" type=\"submit\" ng-disabled=\"loginForm.$invalid || in_progress\">Войти</button> <span ng-if=\"in_progress\" style=\"margin-left: 4px\">...</span></div></form><div class=\"splr-login__err-block\" ng-if=\"err_msg\">Ошибка входа: <span ng-bind=\"err_msg\"></span></div><p><small>*логин и пароль для входа выдаются администрацией сервиса после верификации мастера/салона</small></p><div><a href=\"\" ng-if=\"statePrev.url\" onclick=\"history.back(); return false;\"><span class=\"fa fa-arrow-left\"></span> вернуться назад</a></div></div></div></div></div>");
  $templateCache.put("splr-manager/splr-manager.tpl.html", "<div data-app-toolbar ng-if=\"supplier.id\" data-splr-name=\"supplier.name\" data-splr-id=\"supplier.id\"></div><div class=\"app-content mngr\" tabindex=\"-1\" app-scroll-watcher app-vpos=\"vpos\"><div class=\"mngr__wrap\" ng-if=\"supplier\"><div ng-if=\"sessData.is_editor || is_owner\"><ul class=\"mngr__menu\"><li><a class=\"mngr__menu-link\" ui-sref=\"byt.splrManager.profile\">Профиль</a></li><li><a class=\"mngr__menu-link\" ui-sref=\"byt.splrManager.address\">Адрес</a></li><li><a class=\"mngr__menu-link\" ui-sref=\"byt.splrManager.social\">Контакты</a></li><li><a class=\"mngr__menu-link\" ui-sref=\"byt.splrManager.servList\">Услуги</a></li></ul><div ng-if=\"!supplier.master_address.geo_district_id\" class=\"pdng text-center\" style=\"border: 1px solid red\"><a ui-sref=\"byt.splrManager.address\">Необходимо указать город</a></div><div class=\"fade mngr__content\" ui-view=\"managerContent\">выберите раздел</div></div><div ng-if=\"!sessData.is_editor && !is_owner\"><div class=\"mrgn pdng text-center\">Необходимо <a ui-sref=\"byt.oauthLogin\">авторизоваться</a> для доступа в личный кабинет</div></div></div><div ng-if=\"err_msg\"><div class=\"err-msg\" ng-bind=\"err_msg\"></div><div class=\"err-alt\"><a ui-sref=\"byt.welcome\">Вернуться на главную</a></div></div></div>");
  $templateCache.put("welcome/agglo-slr.tpl.html", "<div class=\"agglo-slr\"><div class=\"agglo-slr__header\">Выберите город</div><div class=\"agglo-slr__auto\"><span class=\"agglo-slr__city\" ng-if=\"agglo_calc\"><a ui-sref=\"byt.aggloItem.specList({agglo_local_name: agglo_calc.local_name})\">{{agglo_calc.local_name}} </a></span><span class=\"agglo-slr__autodefine\" ng-if=\"!agglo_calc && !err_calc\">автоопределение...</span><div class=\"err-msg\" ng-if=\"err_calc\">{{err_calc}}</div></div><div class=\"agglo-slr__manual\"><a ui-sref=\"byt.aggloList\">выбрать другой город</a></div></div>");
  $templateCache.put("welcome/wlc.tpl.html", "<div data-app-toolbar></div><div class=\"app-content\"><div class=\"pure-g\"><div class=\"pure-u pure-u-md-1-4\"></div><div class=\"pure-u-1 pure-u-md-1-2\"><div class=\"wlc\"><h1 class=\"wlc__header\">Мастера и салоны красоты</h1><p class=\"wlc__description\">Парикмахеры, стилисты, визажисты, услуги по уходу за ногтями, бровями и ресницами - более 30 000 мастеров и салонов красоты.</p><div class=\"wlc__agglo-wrap\" ng-include=\"\'welcome/agglo-slr.tpl.html\'\"></div><div class=\"wlc__test text-center\"><a ui-sref=\"byt.quizItem.qstnList({quiz_ttl: \'какая-прическа-мне-подойдет\'})\"><span class=\"fa fa-question-circle\"></span> Тест: какая прическа мне подойдет</a></div></div></div></div><div data-app-footer></div></div>");
  $templateCache.put("agglo-item/offer-list/offer-list.tpl.html", "<div ng-controller=\"OfferListController as ctrl\" ng-if=\"ctrl.offer_list.length > 0\"><div><span>действующие скидки</span></div><div ng-repeat=\"ofr in ctrl.offer_list\"><div><span ng-bind=\"ofr.percent\"></span>%</div><div><div>v<div ng-repeat=\"rbr in ofr.rubric_names\"><span ng-bind=\"rbr\"></span></div></div></div><div class=\"pdng\"><span ng-bind=\"ofr.conditions\"></span><br>окончание акции: <span ng-bind=\"ofr.end_time*1000 | date : \'d MMMM\'\"></span></div><div class=\"pdng\"><span ng-bind=\"ofr.master_address.description\"></span></div><div><button class=\"app-button\" analytics-on analytics-category=\"offer\" analytics-event=\"offer-{{$index+1}}\" ui-sref=\"byt.splrItem.view({supplier_id:ofr.master_profile.id, name: ofr.master_profile.name})\">{{ofr.master_profile.name}}</button></div></div><div class=\"pdng\"><small>Вы - мастер? Оставьте свою скидку в <a target=\"_blank\" href=\"//vk.com/topic-92002771_31699472\">группе приложения</a></small></div></div>");
  $templateCache.put("agglo-item/spec-item/spec-item.tpl.html", "<div class=\"full-height\" data-ng-if=\"cur_spec\" data-ui-view=\"specItemContent\"></div><div ng-if=\"is_prg\"><div ng-if=\"!err_cur_spec && !cur_spec\"><div class=\"text-center pdng\">загрузка специализации...</div></div></div><div ng-if=\"err_cur_spec\"><div class=\"err-msg\" ng-bind=\"err_cur_spec.msg\"></div><div class=\"err-alt\"><a ng-href=\"{{home_href}}\">Перейти к выбору услуг в городе {{cur_agglo.local_name}}</a></div></div>");
  $templateCache.put("agglo-item/spec-list/spec-list.tpl.html", "<div data-app-toolbar data-agglo-name=\"agglo.local_name\"></div><div class=\"app-content spec-list\"><h1 class=\"spec-list__header\">{{agglo.local_name}}</h1><ul class=\"spec-list__list\"><li class=\"spec-list__li\" ng-repeat=\"grp in groups\"><div class=\"spec-list__item-wrap\"><a class=\"spec-list__item-link\" ng-href=\"{{calcHref(grp.name)}}\">{{grp.name}}</a></div></li></ul><div ng-if=\"is_prg\"><div ng-if=\"!groups && !err_groups\"><div class=\"text-center\">загрузка категорий...</div></div></div><div ng-if=\"err_groups\"><div class=\"err-msg\" ng-bind=\"err_groups.msg\"></div></div><div data-app-footer></div></div>");
  $templateCache.put("drct/app-footer/app-footer.tpl.html", "<footer class=\"app-footer\"><div class=\"pdng\"><a href=\"/about\" target=\"_self\">о проекте </a><a href=\"/agreement\" target=\"_self\">регламент </a><a href=\"//miskra.ru/login\" target=\"_blank\">вход для мастеров </a><a href=\"//vk.com/miskra_club\" target=\"_blank\">группа ВК </a><a href=\"https://vk.com/miskra_app\" ng-if=\"is_web\" target=\"_blank\">приложение ВК </a><a href=\"http://blog.miskra.ru\" target=\"_blank\">блог </a><a href=\"//miskra.ru\" target=\"_blank\">веб-сайт</a></div><div class=\"pdng text-center\" ng-if=\"is_web\"><div app-informer></div></div></footer>");
  $templateCache.put("drct/app-informer/app-informer.tpl.html", "<div><a href=\"https://metrika.yandex.ru/stat/?id=29726915&amp;from=informer\" target=\"_blank\" rel=\"nofollow\"><img src=\"https://informer.yandex.ru/informer/29726915/3_0_FFFFFFFF_EEEEEEFF_0_pageviews\" style=\"width:88px; height:31px; border:0\" alt=\"Яндекс.Метрика\" title=\"Яндекс.Метрика: данные за сегодня (просмотры, визиты и уникальные посетители)\" onclick=\"try{Ya.Metrika.informer({i:this,id:29726915,lang:\'ru\'});return false}catch(e){}\"></a></div>");
  $templateCache.put("drct/app-share-block/app-share-block.tpl.html", "<div class=\"share-block\"><span class=\"share-pretext\">Поделиться с друзьями: </span><a class=\"share-vk\" target=\"_blank\" ng-href=\"http://vk.com/share.php?url={{ permalink }}&image={{ pageImage }}\" title=\"Вконтакте\" onclick=\"window.open(this.href, \'\', \'width=550,height=235\');return false;\"><i class=\"fa fa-vk\"></i> </a><a class=\"share-odnoklassniki\" target=\"_blank\" ng-href=\"http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st.comments={{ title }}&st._surl={{ permalink }}\" title=\"Одноклассники\" onclick=\"window.open(this.href, \'\', \'width=550,height=235\');return false;\"><i class=\"fa fa-odnoklassniki\"></i> </a><a class=\"share-mailru\" target=\"_blank\" ng-href=\"http://connect.mail.ru/share?url={{ permalink }}&title={{ title }}\" title=\"MailRu\" onclick=\"window.open(this.href, \'\', \'width=550,height=235\');return false;\"><i class=\"fa fa-at\"></i></a></div>");
  $templateCache.put("drct/app-toolbar/app-toolbar.tpl.html", "<div class=\"app-toolbar\"><div class=\"app-toolbar__user\" user-status-drct></div><div class=\"app-toolbar__search\"><a href=\"https://miskra.ru/search\" target=\"_blank\" title=\"Поиск по сайту miskra.ru\"><i class=\"fa fa-search\"></i></a></div><div class=\"app-toolbar__bread\"><div class=\"app-toolbar__bread-wrap\" data-breadcrumb-drct data-agglo-name=\"aggloName\" data-spec-name=\"specName\" data-rubric-name=\"rubricName\" data-rview-id=\"rviewId\" data-rview-name=\"rviewName\" data-splr-id=\"splrId\" data-splr-name=\"splrName\"></div></div></div>");
  $templateCache.put("drct/tbl-item/tbl-item.tpl.html", "<header class=\"tbl-item\"><div class=\"tbl-item__ava-name\"><div class=\"tbl-item__avatar-wrap\"><a aria-label=\"Информация о мастере\" ng-click=\"saveHash(supItem.id)\" ui-sref=\"byt.splrItem.main({supplier_id:supItem.id, name: supItem.name})\" analytics-on analytics-category=\"masterinfo\" analytics-event=\"masterinfo-tbl\"><span ng-if=\"supItem && !supItem.avatar\"><img class=\"tbl-item__avatar-logo\" src=\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAC4ALgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3qiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAQ9DRSnoaKACiiigAooooAKKKKACjpUMk6pwOT/KqzSM/3j+FAFpriNeh3fSojcseigVBTlVm6AmgB/wBok9f0o8+T+9+lAgk9PzNL9mf/AGaAE8+T+9n8KcLlh1UGmm3kHbP0NMKMvVSKALS3CN1yPrUoIIyDWfSo7IflOKAL9FQxzhuG4P6VNQAUUUUAFFFFAAehooPQ0UAFFFFABRRRQAVVmnJyqdPX1onlydinjv71BQAVJHC0nsvqaWAIXw3XsKuUARJAi9sn3qWiigAooooAKKKKAI3hRu2D6iq7wMnPUetXKKAM+pYpinytyP5VJLAD8yDB9PWq3160AaAORkHiiqkEuw7W+6f0q3QAUUUUAB6Gig9DRQAUUUUAFRTybEwOpqWqEj73LUANqUQM0e4dewpIU8x+fujk1doAz6tQzbvlY8+vrSTQ7vmXr3HrVbvQBoUVDDNu+Vj83r61NQAUVG0yIcE8+1N+0Lno1AE1FMWVH6Hn0p9ABRRTQ6k4DAmgB1QTxbvnXr3qeigDPqzbybl2nqOlRTx7HyPummIxRgw7UAX6KQEEAjvS0AB6Gig9DRQAUUUUARTttix3PFU6nuW+cD0FRIu5wPU0AW4F2xj1PNPZgoyTgUtV7onCjtQAG69E4+tIyiZS6cN3FQUqsUO4daAEqdJPNQxscN2PrSMomXen3u4qCgCaJRHLh+OOM1Z3L6iq6sJl2P8Ae7GozE6nlT9aACTb5hKdKkS4ZVww3e9Q0UATm5JUjb+tQKdrBsdKKKALAuueU4+tTqwdcg8VQqe1PLDtigCaVd8ZHfqKo1o1RkG2Rh70AWLZsx49KmqpbNiQj1FW6AA9DRQehooAKKKKAKdx/rj7YotxmYfnRP8A65qW2/1n4UAW6r3X8FWKr3X8FAFeiiigBVYowYcEVMyiZd6fe7ioKuQrtiX35oApdKtQzbvlbr6+tE0O7LL17j1qr396ALzxq45HPrVR0MbbTU8M2/Ct19fWluVzHu7g0AVaKKKACp7X7zfSoKntfvN9KALNVLkYk+oq3Va5++v0oAiiOJVPvV6qC/eGPWr9AAehooPQ0UAFFFFAFOfiY0W5xKPenXI+cH1FRIdrqfQ0AX6r3X8FWKr3X8NAFeiiigAq9GcxqR6VRqxbyfwH8KALFQTQ7vmX73f3qeigDOqwknmoY2OG7H1p80O75lHzdx61VoAVlKNhhgikqdWEy7HOG7GoWUo2GGCKAEqe1+830qCprX7zfSgC1VS5OZR7CrdUZW3SMfegAiGZFHvV6qlsMyZ7AVboAD0NFB6GigAooooAiuF3R59KqVoEZGDVB1KOV9KALcL7ox6jg0y6HCntmooJNj89D1q2QCMHkGgChRVk2q54Yij7MP736UAVqKs/Zh/e/Sj7MP736UARpcOvB+Ye9P8AtQ/uGl+zD+9+lH2Yf3v0oAja4ckEcAU5lEyl0+93FO+zD+9+lKtvsbcHIP0oAq/zqZWEy7H4YdDT5od2WX73f3qr3oAcylGwRyKmtQcse3ShGWYBJPvdj61YVQoAAwKAGyNsjJ79qo1NcSbm2joKjVSzADqaALNsuEJ9ampFAVQB0FLQAHoaKD0NFABRRRQAVDPHuXcOo/lU1FAGfVmCXcNjde3vUc8W07h909vSoqANCioIp93yvwfX1qegAooooAKKKKACiiigAqCaHd8yj5vT1qeigDO/nU/2hvL2/wAXrST7N3y/e74qKgBKtW0eBvPU9Kihi8w5P3R+tXKACiiigAPQ0UHoaKACiiigAooooACMgg9KqSwFPmXlf5VbooAz6kjnZBg8rUsluG5Xg+lV2VkOGBFAFxZUfoefQ0+s408SOvRjQBeoqoLlx6H8KX7S390UAWqKqG5c9ABTGldurGgC28qJ1P4VXknZuF4H61D9acqsxwoyaAG1LFCZOTwv86kjtwOX5PpVigBAAowBgCloooAKKKKAA9DRQehooAKKKKACiiigAooooAKQgEYIyKWigCFrZD93K1EbZx0wat0UAUTE46qabtPTBrQooAoiNyeFNPFs564H41booAhW2UdSTUoAUYAwKWigAooooAKKKKACiiigAPQ0UHoaKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAD0NFFFAH//Z\" alt=\"аватар\" itemprop=\"logo\"> </span><span ng-if=\"supItem.avatar\"><img class=\"tbl-item__avatar-logo\" ng-if=\"supItem.work_scope\" ng-src=\"{{supItem.avatar}}\" alt=\"аватар\" itemprop=\"logo\" onerror=\"this.onerror=null;this.src=\'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAC4ALgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3qiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAQ9DRSnoaKACiiigAooooAKKKKACjpUMk6pwOT/KqzSM/3j+FAFpriNeh3fSojcseigVBTlVm6AmgB/wBok9f0o8+T+9+lAgk9PzNL9mf/AGaAE8+T+9n8KcLlh1UGmm3kHbP0NMKMvVSKALS3CN1yPrUoIIyDWfSo7IflOKAL9FQxzhuG4P6VNQAUUUUAFFFFAAehooPQ0UAFFFFABRRRQAVVmnJyqdPX1onlydinjv71BQAVJHC0nsvqaWAIXw3XsKuUARJAi9sn3qWiigAooooAKKKKAI3hRu2D6iq7wMnPUetXKKAM+pYpinytyP5VJLAD8yDB9PWq3160AaAORkHiiqkEuw7W+6f0q3QAUUUUAB6Gig9DRQAUUUUAFRTybEwOpqWqEj73LUANqUQM0e4dewpIU8x+fujk1doAz6tQzbvlY8+vrSTQ7vmXr3HrVbvQBoUVDDNu+Vj83r61NQAUVG0yIcE8+1N+0Lno1AE1FMWVH6Hn0p9ABRRTQ6k4DAmgB1QTxbvnXr3qeigDPqzbybl2nqOlRTx7HyPummIxRgw7UAX6KQEEAjvS0AB6Gig9DRQAUUUUARTttix3PFU6nuW+cD0FRIu5wPU0AW4F2xj1PNPZgoyTgUtV7onCjtQAG69E4+tIyiZS6cN3FQUqsUO4daAEqdJPNQxscN2PrSMomXen3u4qCgCaJRHLh+OOM1Z3L6iq6sJl2P8Ae7GozE6nlT9aACTb5hKdKkS4ZVww3e9Q0UATm5JUjb+tQKdrBsdKKKALAuueU4+tTqwdcg8VQqe1PLDtigCaVd8ZHfqKo1o1RkG2Rh70AWLZsx49KmqpbNiQj1FW6AA9DRQehooAKKKKAKdx/rj7YotxmYfnRP8A65qW2/1n4UAW6r3X8FWKr3X8FAFeiiigBVYowYcEVMyiZd6fe7ioKuQrtiX35oApdKtQzbvlbr6+tE0O7LL17j1qr396ALzxq45HPrVR0MbbTU8M2/Ct19fWluVzHu7g0AVaKKKACp7X7zfSoKntfvN9KALNVLkYk+oq3Va5++v0oAiiOJVPvV6qC/eGPWr9AAehooPQ0UAFFFFAFOfiY0W5xKPenXI+cH1FRIdrqfQ0AX6r3X8FWKr3X8NAFeiiigAq9GcxqR6VRqxbyfwH8KALFQTQ7vmX73f3qeigDOqwknmoY2OG7H1p80O75lHzdx61VoAVlKNhhgikqdWEy7HOG7GoWUo2GGCKAEqe1+830qCprX7zfSgC1VS5OZR7CrdUZW3SMfegAiGZFHvV6qlsMyZ7AVboAD0NFB6GigAooooAiuF3R59KqVoEZGDVB1KOV9KALcL7ox6jg0y6HCntmooJNj89D1q2QCMHkGgChRVk2q54Yij7MP736UAVqKs/Zh/e/Sj7MP736UARpcOvB+Ye9P8AtQ/uGl+zD+9+lH2Yf3v0oAja4ckEcAU5lEyl0+93FO+zD+9+lKtvsbcHIP0oAq/zqZWEy7H4YdDT5od2WX73f3qr3oAcylGwRyKmtQcse3ShGWYBJPvdj61YVQoAAwKAGyNsjJ79qo1NcSbm2joKjVSzADqaALNsuEJ9ampFAVQB0FLQAHoaKD0NFABRRRQAVDPHuXcOo/lU1FAGfVmCXcNjde3vUc8W07h909vSoqANCioIp93yvwfX1qegAooooAKKKKACiiigAqCaHd8yj5vT1qeigDO/nU/2hvL2/wAXrST7N3y/e74qKgBKtW0eBvPU9Kihi8w5P3R+tXKACiiigAPQ0UHoaKACiiigAooooACMgg9KqSwFPmXlf5VbooAz6kjnZBg8rUsluG5Xg+lV2VkOGBFAFxZUfoefQ0+s408SOvRjQBeoqoLlx6H8KX7S390UAWqKqG5c9ABTGldurGgC28qJ1P4VXknZuF4H61D9acqsxwoyaAG1LFCZOTwv86kjtwOX5PpVigBAAowBgCloooAKKKKAA9DRQehooAKKKKACiiigAooooAKQgEYIyKWigCFrZD93K1EbZx0wat0UAUTE46qabtPTBrQooAoiNyeFNPFs564H41booAhW2UdSTUoAUYAwKWigAooooAKKKKACiiigAPQ0UHoaKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAD0NFFFAH//Z\';\"></span></a></div><div class=\"tbl-item__name-wrap\"><div><a itemprop=\"url\" ui-sref=\"byt.splrItem.main({supplier_id:supItem.id, name: supItem.name})\" ng-click=\"saveHash(supItem.id)\" analytics-on analytics-category=\"masterinfo\" analytics-event=\"masterinfo-tbl\"><span ng-bind=\"supItem.name\" itemprop=\"name\"></span></a></div></div><div class=\"tbl-item__edit-wrap\" ng-if=\"isEditable\"><a target=\"_blank\" ui-sref=\"byt.splrManager.servItem({supplier_id: supItem.id, id: supItem.master_serv.id})\"><i class=\"fa fa-edit\"></i></a></div></div><div class=\"tbl-item__addt\"><div class=\"tbl-item__bio\"><span ng-bind=\"supItem.bio\"></span></div><div class=\"tbl-item__address-wrap\" itemprop=\"address\" itemscope itemtype=\"http://schema.org/PostalAddress\"><div><span class=\"tbl-item__address-city\" itemprop=\"addressLocality\" ng-bind=\"cityName\"></span> <span class=\"tbl-item__address-street\" ng-bind=\"supItem.sup_geo\" ng-if=\"supItem.sup_geo\" itemprop=\"streetAddress\"></span></div><div class=\"tbl-item__is_out\" ng-if=\"supItem.master_serv.is_out\">возможен выезд на дом <span ng-if=\"supItem.cus_geo\" ng-bind=\"supItem.cus_geo\"></span></div></div></div><div class=\"tbl-item__price\" ng-if=\"supItem.master_serv.price_from || supItem.master_serv.price_to\"><strong>Цена</strong>: <span ng-if=\"supItem.master_serv.price_from\">от {{supItem.master_serv.price_from}} </span><span ng-if=\"supItem.master_serv.price_to\">до {{supItem.master_serv.price_to}} </span>руб.</div><div class=\"tbl-item__price\" ng-if=\"supItem.master_serv.time_from || supItem.master_serv.time_to\"><strong>Время выполнения</strong>: <span ng-if=\"supItem.master_serv.time_from\">от {{supItem.master_serv.time_from}} </span><span ng-if=\"supItem.master_serv.time_to\">до {{supItem.master_serv.time_to}} </span>минут</div></header>");
  $templateCache.put("drct/user-status/user-status.tpl.html", "<div class=\"user-status\"><div ng-if=\"!sessData.is_loaded\"><div class=\"text-center\">...</div></div><div ng-if=\"sessData.is_loaded\"><div ng-if=\"!sessData.uid\"><a class=\"user-status__icon\" ng-href=\"{{href_login}}\"><span class=\"fa fa-sign-in\"></span></a></div><div ng-if=\"sessData.uid\"><div ng-if=\"sessData.is_supplier\"><a ng-href=\"{{href_supplier}}\"><span class=\"back-img user-status__img\" ng-if=\"sessData.avatar\" ng-style=\"{\'background-image\': \'url({{sessData.avatar}})\'}\"></span> <span class=\"user-status__icon\" ng-if=\"!sessData.avatar\"><span class=\"fa fa-user\"></span></span></a></div><div ng-if=\"sessData.is_editor\"><button class=\"empty-button user-status__icon\" ng-click=\"confirmLogout()\"><span ng-if=\"sessData.is_moder\" class=\"fa fa-empire\"></span> <span ng-if=\"!sessData.is_moder\" class=\"fa fa-user-secret\"></span></button></div><div ng-if=\"!sessData.is_editor && !sessData.is_supplier\"><span class=\"back-img user-status__img\" ng-if=\"sessData.avatar\" ng-style=\"{\'background-image\': \'url({{sessData.avatar}})\'}\"></span> <span class=\"user-status__icon\" ng-if=\"!sessData.avatar\"><span class=\"fa fa-user\"></span></span></div></div></div></div>");
  $templateCache.put("drct/work-gallery/work-gallery.tpl.html", "<div class=\"wgal\"><div class=\"wgal__photo-wrap\" ng-if=\"workScope.arr.length > 0\"><div class=\"wgal__work-slide\" ng-repeat=\"item in workScope.arr\"><div ng-if=\"item.main_video\"><div class=\"ximg\"><div class=\"ximg__img\" ng-if=\"$first || stateShow.val\" ytb-video data-yid=\"{{item.main_video}}\"></div></div></div><div ng-if=\"item.preview_img\" app-gallery-item app-item=\"item\" app-wrap-elem-id=\"wrapElemId\" app-is-show-image=\"$first || stateShow.val\"></div><footer class=\"wgal__footer\"><span ng-if=\"!item.side_link\">&nbsp;</span> <span ng-if=\"item.side_link\"><a target=\"_blank\" ng-href=\"{{item.side_link}}\">photo </a>by <a ng-href=\"https://www.instagram.com/{{supItem.username}}/\" target=\"_blank\" ng-bind=\"supItem.username\"></a> on <a href=\"https://www.instagram.com\" target=\"_blank\">instagram</a></span></footer><button class=\"wgal__arrow wgal__prev\" title=\"предыдущее фото\" ng-if=\"workScope.arr.length > 1\" onclick=\"this.parentNode.parentNode.scrollLeft -= this.parentNode.clientWidth;\" ng-disabled=\"$first\" analytics-on analytics-category=\"gallerytbl\" analytics-event=\"gallerytbl-prev\"><i class=\"fa fa-chevron-left\"></i></button> <button class=\"wgal__arrow wgal__next\" title=\"следующее фото\" ng-if=\"workScope.arr.length > 1\" ng-click=\"switchNext()\" ng-disabled=\"$last\" onclick=\"this.parentNode.parentNode.scrollLeft += this.parentNode.clientWidth;\" analytics-on analytics-category=\"gallerytbl\" analytics-event=\"gallerytbl-next\"><i class=\"fa fa-chevron-right\"></i></button></div></div><div ng-if=\"!workScope.arr && !workScope.err\"><div class=\"ximg\"><div class=\"ximg__img ximg__wait\">...</div></div><footer class=\"wgal__footer\"></footer></div><div ng-if=\"workScope.arr && workScope.arr.length === 0\"><div class=\"ximg\"><div class=\"ximg__img ximg__nothing\">нет фото</div></div><footer class=\"wgal__footer\"></footer></div><div ng-if=\"workScope.err\"><div class=\"ximg\"><div class=\"ximg__img ximg__nothing\">нет фото</div></div><footer class=\"wgal__footer\"></footer></div></div>");
  $templateCache.put("splr/main/splr-ad.tpl.html", "<div><div class=\"splr__sub-header\">Специальное предложение</div><div><div ng-if=\"vfirm.ads_ref\"><a target=\"_blank\" ng-href=\"{{vfirm.ads_ref.link}}\">{{vfirm.ads_ref.text}}</a></div></div><p></p><p ng-if=\"vfirm.ads_article\"><span ng-bind-html=\"vfirm.ads_article\"></span></p><p ng-if=\"vfirm.ads_warning\"><small ng-bind-html=\"vfirm.ads_warning\"></small></p><p></p></div>");
  $templateCache.put("splr/main/splr-address.tpl.html", "<ul ng-if=\"vfirm.city_name\"><li class=\"ctct\"><div class=\"clearfix\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-home\"></span></div><div class=\"ctct__text-wrap\"><div itemprop=\"address\" itemscope itemtype=\"http://schema.org/PostalAddress\"><span itemprop=\"addressLocality\" ng-bind=\"vfirm.city_name\"></span> <span ng-if=\"vfirm.address\"><span>, </span><a ng-href=\"http://maps.apple.com/?q={{vfirm.city_name | enclink}}{{\', \' | enclink}}{{vfirm.address | enclink}}\" target=\"_blank\" rel=\"nofollow\" analytics-on analytics-category=\"contact\" analytics-event=\"contact-geo\"><span itemprop=\"streetAddress\" ng-bind=\"vfirm.address\"></span> <sup><span class=\"fa fa-external-link\"></span></sup></a></span></div><div class=\"ctct__text-sub\">адрес мастера / салона</div></div></div></li><li ng-if=\"vfirm.address_comment\" class=\"ctct\" style=\"padding-top: 16px\"><div class=\"clearfix\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-street-view\"></span></div><div class=\"ctct__text-wrap\"><div><span ng-bind=\"vfirm.address_comment\"></span></div><div class=\"ctct__text-sub\">как добраться / найти</div></div></div></li><li ng-if=\"vfirm.out_geo\" class=\"ctct\" style=\"padding-top: 16px\"><div class=\"clearfix\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-sign-out\"></span></div><div class=\"ctct__text-wrap\"><div><span ng-bind=\"vfirm.out_geo\"></span></div><div class=\"ctct__text-sub\">районы, работа на выезде</div></div></div></li></ul>");
  $templateCache.put("splr/main/splr-main.tpl.html", "<div data-app-toolbar ng-if=\"!is_map\" data-agglo-name=\"vfirm.city_name\" data-splr-name=\"vfirm.name\" data-splr-id=\"vfirm.id\"></div><div data-app-toolbar ng-if=\"is_map\" data-agglo-name=\"vfirm.city_name\"></div><div class=\"app-content\" app-scroll-watcher tabindex=\"-1\" app-vpos=\"vpos\"><div ng-if=\"is_prg\"><div ng-if=\"!vfirm && !err_msg\"><div class=\"text-center pdng\">загрузка информации...</div></div></div><div class=\"fade splr\" ng-if=\"vfirm\" itemscope itemtype=\"http://schema.org/BeautySalon\"><div class=\"pure-g\"><div class=\"pure-u-1 pure-u-sm-1 pure-u-md-1-8\"></div><div class=\"pure-u-1 pure-u-sm-1-4 pure-u-md-1-4\"><div class=\"splr__side-panel\" ng-if=\"!is_map\"><div ng-if=\"vfirm.avatar\"><img class=\"splr__avatar\" ng-src=\"{{vfirm.avatar}}\" itemprop=\"logo\" onerror=\"this.onerror=null;this.src=\'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAC4ALgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3qiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAQ9DRSnoaKACiiigAooooAKKKKACjpUMk6pwOT/KqzSM/3j+FAFpriNeh3fSojcseigVBTlVm6AmgB/wBok9f0o8+T+9+lAgk9PzNL9mf/AGaAE8+T+9n8KcLlh1UGmm3kHbP0NMKMvVSKALS3CN1yPrUoIIyDWfSo7IflOKAL9FQxzhuG4P6VNQAUUUUAFFFFAAehooPQ0UAFFFFABRRRQAVVmnJyqdPX1onlydinjv71BQAVJHC0nsvqaWAIXw3XsKuUARJAi9sn3qWiigAooooAKKKKAI3hRu2D6iq7wMnPUetXKKAM+pYpinytyP5VJLAD8yDB9PWq3160AaAORkHiiqkEuw7W+6f0q3QAUUUUAB6Gig9DRQAUUUUAFRTybEwOpqWqEj73LUANqUQM0e4dewpIU8x+fujk1doAz6tQzbvlY8+vrSTQ7vmXr3HrVbvQBoUVDDNu+Vj83r61NQAUVG0yIcE8+1N+0Lno1AE1FMWVH6Hn0p9ABRRTQ6k4DAmgB1QTxbvnXr3qeigDPqzbybl2nqOlRTx7HyPummIxRgw7UAX6KQEEAjvS0AB6Gig9DRQAUUUUARTttix3PFU6nuW+cD0FRIu5wPU0AW4F2xj1PNPZgoyTgUtV7onCjtQAG69E4+tIyiZS6cN3FQUqsUO4daAEqdJPNQxscN2PrSMomXen3u4qCgCaJRHLh+OOM1Z3L6iq6sJl2P8Ae7GozE6nlT9aACTb5hKdKkS4ZVww3e9Q0UATm5JUjb+tQKdrBsdKKKALAuueU4+tTqwdcg8VQqe1PLDtigCaVd8ZHfqKo1o1RkG2Rh70AWLZsx49KmqpbNiQj1FW6AA9DRQehooAKKKKAKdx/rj7YotxmYfnRP8A65qW2/1n4UAW6r3X8FWKr3X8FAFeiiigBVYowYcEVMyiZd6fe7ioKuQrtiX35oApdKtQzbvlbr6+tE0O7LL17j1qr396ALzxq45HPrVR0MbbTU8M2/Ct19fWluVzHu7g0AVaKKKACp7X7zfSoKntfvN9KALNVLkYk+oq3Va5++v0oAiiOJVPvV6qC/eGPWr9AAehooPQ0UAFFFFAFOfiY0W5xKPenXI+cH1FRIdrqfQ0AX6r3X8FWKr3X8NAFeiiigAq9GcxqR6VRqxbyfwH8KALFQTQ7vmX73f3qeigDOqwknmoY2OG7H1p80O75lHzdx61VoAVlKNhhgikqdWEy7HOG7GoWUo2GGCKAEqe1+830qCprX7zfSgC1VS5OZR7CrdUZW3SMfegAiGZFHvV6qlsMyZ7AVboAD0NFB6GigAooooAiuF3R59KqVoEZGDVB1KOV9KALcL7ox6jg0y6HCntmooJNj89D1q2QCMHkGgChRVk2q54Yij7MP736UAVqKs/Zh/e/Sj7MP736UARpcOvB+Ye9P8AtQ/uGl+zD+9+lH2Yf3v0oAja4ckEcAU5lEyl0+93FO+zD+9+lKtvsbcHIP0oAq/zqZWEy7H4YdDT5od2WX73f3qr3oAcylGwRyKmtQcse3ShGWYBJPvdj61YVQoAAwKAGyNsjJ79qo1NcSbm2joKjVSzADqaALNsuEJ9ampFAVQB0FLQAHoaKD0NFABRRRQAVDPHuXcOo/lU1FAGfVmCXcNjde3vUc8W07h909vSoqANCioIp93yvwfX1qegAooooAKKKKACiiigAqCaHd8yj5vT1qeigDO/nU/2hvL2/wAXrST7N3y/e74qKgBKtW0eBvPU9Kihi8w5P3R+tXKACiiigAPQ0UHoaKACiiigAooooACMgg9KqSwFPmXlf5VbooAz6kjnZBg8rUsluG5Xg+lV2VkOGBFAFxZUfoefQ0+s408SOvRjQBeoqoLlx6H8KX7S390UAWqKqG5c9ABTGldurGgC28qJ1P4VXknZuF4H61D9acqsxwoyaAG1LFCZOTwv86kjtwOX5PpVigBAAowBgCloooAKKKKAA9DRQehooAKKKKACiiigAooooAKQgEYIyKWigCFrZD93K1EbZx0wat0UAUTE46qabtPTBrQooAoiNyeFNPFs564H41booAhW2UdSTUoAUYAwKWigAooooAKKKKACiiigAPQ0UHoaKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAD0NFFFAH//Z\';\"></div></div></div><div class=\"pure-u-1 pure-u-sm-3-4 pure-u-md-1-2\"><div class=\"splr__main-panel\"><h1 itemprop=\"name\" ng-bind=\"vfirm.name\"></h1><div class=\"splr__status\"><sup ng-if=\"vfirm.is_company\">салон</sup></div><div class=\"splr__dscr\"><span itemprop=\"description\" ng-bind=\"vfirm.bio\" ng-if=\"vfirm.bio\"></span></div><div class=\"splr__params\"><div ng-include=\"\'splr/main/splr-address.tpl.html\'\"></div><ul class=\"ctct-list\"><li class=\"ctct-list__item\" ng-repeat=\"ctct in vfirm.contacts\"><div data-splr-contact-drct data-ctct=\"ctct\"></div></li></ul></div><div class=\"splr__ads\" ng-if=\"vfirm.ads_article\"><div ng-include=\"\'splr/main/splr-ad.tpl.html\'\"></div></div><div ng-if=\"sessData.is_editor || vfirm.id === sessData.uid\"><div class=\"pdng\"><app-splr-fill data-contacts=\"vfirm.contacts\" data-address=\"vfirm.address\" data-bio=\"vfirm.bio\"></app-splr-fill></div><div class=\"pdng\"><a ui-sref=\"byt.splrManager.profile({supplier_id: vfirm.id})\" analytics-on analytics-category=\"master\" analytics-event=\"edit\"><span class=\"fa fa-pencil\"></span> Редактировать профиль</a></div></div><div class=\"pdng\" ng-if=\"vfirm.id === sessData.uid\"><button class=\"app-button\" ng-click=\"logout()\" analytics-on analytics-category=\"master\" analytics-event=\"exit\">Выйти из аккаунта</button></div></div></div><div class=\"pure-u-1 pure-u-sm-1 pure-u-md-1-8\"></div></div><div class=\"splr__serv-list\" ng-if=\"arr_master_serv.length > 0\"><div class=\"pure-g\"><div class=\"pure-u-1 pure-u-sm-1-2 pure-u-md-1-3\" ng-repeat=\"msrv in arr_master_serv\" on-finish-render=\"servListRepeatFinished\"><div class=\"splr__serv-item\" id=\"serv{{msrv.id}}\"><div data-splr-serv-drct data-msrv=\"msrv\" data-city-spec-href=\"calcCitySpecHref(msrv, vfirm.city_name)\" data-is-editable=\"sessData.is_editor || vfirm.id === sessData.uid\"></div><div app-work-gallery app-sup-item=\"vfirm\" app-work-scope=\"msrv.work_scope\" app-wrap-elem-id=\"\"></div></div></div></div></div><div class=\"splr__soc-block\" ng-if=\"url_to_share && !is_map\"><div class=\"splr__soc-item\"><div app-vk-like data-subject-id=\"supplier{{vfirm.id}}\" data-subject-url=\"{{url_to_share}}\" data-page-title=\"{{vfirm.name}}\" data-page-description=\"{{vfirm.bio}}\" data-page-image=\"{{vfirm.avatar}}\" analytics-on=\"click\" analytics-category=\"masteritem\" analytics-event=\"likemaster\"></div></div></div><div class=\"splr__share-block\" ng-if=\"vfirm && url_to_share && !is_map\"><div app-share-block data-title=\"{{vfirm.name}}\" data-permalink=\"{{url_to_share}}\" data-page-image=\"{{vfirm.avatar}}\"></div></div><div class=\"splr__comment-form\" ng-if=\"url_to_share && !is_map\"><div app-comment-form data-subject-id=\"supplier{{vfirm.id}}\" data-subject-url=\"{{url_to_share}}\"></div></div><div class=\"splr__city-link\" ng-if=\"vfirm.city_name\"><a ui-sref=\"byt.aggloItem.specList({agglo_local_name: vfirm.city_name})\"><span ng-if=\"vfirm.city_name_prepositional\">Просмотреть всех мастеров в {{vfirm.city_name_prepositional}} </span><span ng-if=\"!vfirm.city_name_prepositional\">Просмотреть всех мастеров в городе {{vfirm.city_name}}</span></a></div><div ng-if=\"statePrev.url\" class=\"pdng mrgn text-center\"><a ng-href=\"{{statePrev.url}}\" onclick=\"history.back(); return false;\"><span class=\"fa fa-arrow-left\"></span> Вернуться назад</a></div><div class=\"splr__id\"><a ng-href=\"{{supplier_url}}\" itemprop=\"url\">id{{splr.id}}</a></div></div><div ng-if=\"err_msg\"><div class=\"err-msg\" ng-bind=\"err_msg\"></div><div class=\"err-alt\"><a ui-sref=\"byt.welcome\">Перейти на главную страницу</a></div></div><div data-app-footer></div></div>");
  $templateCache.put("splr-manager/address/address-edt.tpl.html", "<form class=\"frm\" name=\"addressForm\"><div class=\"frm__inp\"><label>Адрес мастера / салона</label><input ng-model=\"ggg.supStreet\" placeholder=\"ул. Такая-то, 123\"></div><div class=\"frm__inp\"><label>Комментарий (как найти, пройти)</label><input ng-model=\"ggg.supComment\" placeholder=\"3 подъезд, 2 этаж\"></div><div class=\"frm__inp\"><label>Условия работы на выезде</label><input ng-model=\"ggg.cusConds\"></div><div class=\"frm__but\"><button class=\"app-button\" ng-click=\"updateAddress(mdr, ggg)\">Сохранить</button> <span ng-show=\"update_progress\">сохранение... </span><span ng-show=\"is_saved\">сохранено успешно</span></div></form>");
  $templateCache.put("splr-manager/address/agglo-edt.tpl.html", "<div class=\"frm\"><div class=\"frm__sel\" ng-if=\"arr_geo_agglo.length > 0\"><label>Город<label><select placeholder=\"выберите город\" data-ng-model=\"slc_data.agglo_id\" data-ng-change=\"onSelectedItemChange(slc_data.agglo_id)\"><option value=\"\">---</option><option ng-repeat=\"item in arr_geo_agglo\" value=\"{{item.id}}\">{{item.local_name}}</option></select></label></label></div><div data-ng-if=\"supplier.master_address.geo_district_id\"><div data-address-edt-drct data-mdr=\"supplier.master_address\" data-mdr-geo-district-id=\"supplier.master_address.geo_district_id\" data-mdr-description=\"supplier.master_address.description\"></div></div></div>");
  $templateCache.put("splr-manager/email/email-edt.tpl.html", "<form class=\"frm\" name=\"emailForm\" ng-submit=\"updateEmail(supplier)\"><div class=\"frm__inp\"><label>Email (публичный)</label><input ng-model=\"supplier.main_email\"></div><div class=\"frm__but\"><button class=\"app-button\" ng-disabled=\"update_progress\" type=\"submit\">Сохранить</button> <span ng-show=\"update_progress\">сохранение... </span><span ng-show=\"is_saved\">сохранено успешно</span></div></form>");
  $templateCache.put("splr-manager/fio/fio.tpl.html", "<div></div>");
  $templateCache.put("splr-manager/phone/phone-edt.tpl.html", "<form class=\"frm\" name=\"phoneForm\" ng-submit=\"updatePhone(supplier)\"><div class=\"frm__inp\"><label>Мобильный телефон (публичный)</label><input ng-model=\"supplier.main_phone\" placeholder=\"+79871234567\"></div><div class=\"frm__but\"><button class=\"app-button\" ng-disabled=\"update_progress\" type=\"submit\">Сохранить</button> <span ng-if=\"update_progress\">сохранение... </span><span ng-if=\"is_saved\">сохранено успешно</span></div></form>");
  $templateCache.put("splr-manager/profile/profile-edt.tpl.html", "<form class=\"frm\" name=\"profileForm\" ng-submit=\"updateProfile(supplier)\"><div class=\"frm__rad\"><label><input type=\"radio\" name=\"asdf\" ng-model=\"supplier.is_company\" ng-value=\"false\"> Мастер</label><label><input type=\"radio\" name=\"asdf\" ng-model=\"supplier.is_company\" ng-value=\"true\"> Салон</label></div><div class=\"frm__inp\"><label>Имя/Название</label><input ng-model=\"supplier.name\" required></div><div class=\"frm__inp\"><label>Описание, биография</label><input ng-model=\"supplier.bio\"></div><div class=\"frm__but\"><button class=\"app-button\" ng-disabled=\"update_progress\" type=\"submit\">Сохранить</button> <span ng-show=\"update_progress\">сохранение... </span><span ng-show=\"is_saved\">сохранено успешно</span></div></form><div ng-if=\"is_owner || sessData.is_moder\"><a ui-sref=\"byt.splrManager.removal\" class=\"button-del\">Удаление аккаунта</a></div>");
  $templateCache.put("splr-manager/removal/removal.tpl.html", "<div class=\"text-center\" ng-if=\"is_owner || sessData.is_moder\"><p>Из системы удаляются все данные аккаунта, в том числе контакты, услуги и работы.</p><div ng-if=\"!is_progress\"><div><button class=\"app-button\" ng-click=\"removeAccount(supplier)\">Удалить аккаунт</button></div><div><small>*последующее восстановление аккаунта невозможно</small></div></div><div ng-if=\"is_progress\" class=\"text-center\">удаление...</div><div class=\"err-msg\" ng-if=\"err_msg\">{{err_msg}}</div></div>");
  $templateCache.put("splr-manager/serv-creator/serv-creator-edt.tpl.html", "<div class=\"serv-creator-edt\"><h1 class=\"header\">Добавление услуг</h1><ul class=\"groups\"><li ng-repeat=\"grp in arr_serv_group\"><h2 class=\"group-header\" ng-click=\"is_opened=!is_opened\">{{ grp.name}} <i class=\"fa fa-angle-double-down\" ng-if=\"!is_opened\"></i> <i class=\"fa fa-angle-double-up\" ng-if=\"is_opened\"></i></h2><ul class=\"rubrics\" ng-show=\"is_opened\"><li ng-repeat=\"rbr in grp.arr_serv_rubric | filter: isFree | orderBy:\'name\'\"><label><input type=\"checkbox\" ng-model=\"is_checked\" ng-change=\"handleChange(is_checked, rbr.id)\"> <span>{{ rbr.name }}</span></label></li></ul></li></ul><div><button class=\"app-button\" ng-click=\"addServs(arr_ids)\" ng-disabled=\"arr_ids.length === 0 || is_progress\">Добавить услуги ({{arr_ids.length}})</button> <span ng-if=\"is_progress\">добавление...</span></div><div class=\"back-link\"><a ui-sref=\"byt.splrManager.servList({supplier_id: supplier.id})\">вернуться к перечню услуг</a></div><div class=\"err-msg\" ng-if=\"err_insert\">Возникла непредвиденная ошибка. Попробуйте ещё раз.</div></div>");
  $templateCache.put("splr-manager/serv-item/serv-item-edt.tpl.html", "<div class=\"serv-item-edt\"><div ng-if=\"msrv\"><div class=\"clearfix wrap-header\"><div class=\"wrap-del\" ng-if=\"is_owner || sessData.is_moder\"><button class=\"button-del\" ng-click=\"deleteServ(msrv)\" title=\"удалить услугу\"><i class=\"fa fa-trash\"></i></button></div><h1 class=\"wrap-title\">{{ msrv.serv_rubric_name }}</h1></div><form class=\"serv-form\"><div class=\"form-item\"><div class=\"form-item-header\">Цена услуги, руб.</div><label class=\"lbl\">от <input class=\"inp\" type=\"number\" ng-model=\"msrv.price_from\"></label><label class=\"lbl\">до <input class=\"inp\" type=\"number\" ng-model=\"msrv.price_to\"></label></div><div class=\"form-item\"><div class=\"form-item-header\">Время выполнения, минут</div><label class=\"lbl\">от <input class=\"inp\" type=\"number\" ng-model=\"msrv.time_from\"></label><label class=\"lbl\">до <input class=\"inp\" type=\"number\" ng-model=\"msrv.time_to\"></label></div><div class=\"form-item\"><label><input type=\"checkbox\" ng-model=\"msrv.is_out\"> Возможен выезд на дом</label></div><div class=\"form-item\"><button class=\"app-button\" ng-click=\"updateMsrv(msrv)\">Сохранить</button> <span ng-if=\"update_progress\">сохранение... </span><span ng-if=\"is_saved\">сохранено</span></div><div class=\"err-msg\" ng-if=\"err_update\">{{err_update}}</div></form><div work-list-edt data-master-profile-id=\"supplier.id\" data-serv-rubric-id=\"msrv.serv_rubric_id\" data-serv-rubric-name=\"msrv.serv_rubric_name\" data-vpos=\"vpos\" data-can-delete=\"is_owner || sessData.is_moder\" data-can-insert=\"is_owner || sessData.is_moder\"></div></div><div class=\"err-msg\" ng-if=\"err_msrv\">{{err_msrv.msg}}</div><div ng-if=\"!err_msrv && !msrv\">...</div></div>");
  $templateCache.put("splr-manager/serv-list/serv-list-edt.tpl.html", "<div class=\"serv-list-edt\"><h1 class=\"serv-list-edt__header\">Услуги <a class=\"app-button\" ui-sref=\"byt.splrManager.servCreator\" ng-if=\"is_owner || sessData.is_moder\"><i class=\"fa fa-plus\"></i> Добавить</a></h1><ul class=\"serv-list-edt__list pure-g\" ng-if=\"arr_master_serv\"><li class=\"pure-u-1 pure-u-sm-1-2 pure-u-md-1-4\" ng-repeat=\"msrv in arr_master_serv\"><div class=\"serv-list-edt__item-wrap\"><a class=\"serv-list-edt__item-link\" ui-sref=\"byt.splrManager.servItem({id: msrv.id})\">{{msrv.serv_rubric_name}}</a></div></li></ul><div ng-if=\"err_master_serv\">Ошибка загрузки услуг. Попробуйте позже.</div><div ng-if=\"!err_master_serv && !arr_master_serv\">...</div></div><div ng-if=\"supplier.nstg_id\"><p>Фотографии работ и наименования услуг экспортируются автоматически из вашего аккаунта Инстаграм.</p><p>Первоначальный экспорт запускается в ближайшие пару дней после создания кабинета.</p><p>Дальнейший экспорт (обновление работ и услуг) происходит примерно раз в неделю.</p><p>Для того, чтобы ваши фотографии были экспортированы, необходимо выставить соответствующие тэги к фотографиям в формате #городуслуга или #услугагород, например: #москваманикюр #педикюрмосква #наращиваниересницнабережныечелны #спбстрижка и т.п.</p><p>Тэг должен включать название вашего города и наименование услуги. Название города может быть как полным, так и частоупотребляемым сокращением, например: #санктпетербург или #спб;	#ростовнадону или #рнд;	#новосибирск или #новосиб</p><p>Пробелы и дефисы не разрешены в тэгах. Регистр букв не важен.</p></div>");
  $templateCache.put("splr-manager/social/social-edt.tpl.html", "<div class=\"mngr__soc-block\"><div splr-phone-edt data-supplier=\"supplier\"></div></div><div class=\"mngr__soc-block\" ng-if=\"sessData.is_editor\"><div splr-vkid-edt data-supplier=\"supplier\"></div></div><div class=\"mngr__soc-block\"><form class=\"frm\" name=\"contactForm\" ng-submit=\"updateProfile(supplier)\"><div class=\"frm__inp\"><label>Skype</label><input ng-model=\"supplier.skype\"></div><div class=\"frm__inp\"><label>Twitter</label><input ng-model=\"supplier.twitter\"></div><div class=\"frm__inp\"><label>WhatsApp</label><input ng-model=\"supplier.whatsapp\"></div><div class=\"frm__inp\"><label>Viber</label><input ng-model=\"supplier.viber\"></div><div class=\"frm__inp\"><label>Вконтакте (группа)</label><input ng-model=\"supplier.vkontakte\" placeholder=\"https://vk.com/club123\"></div><div class=\"frm__inp\"><label>Одноклассники</label><input ng-model=\"supplier.odnoklassniki\" placeholder=\"http://ok.ru/club123\"></div><div class=\"frm__inp\"><label>Facebook</label><input ng-model=\"supplier.facebook\" placeholder=\"https://www.facebook.com/club123\"></div><div class=\"frm__inp\"><label>Website</label><input ng-model=\"supplier.website\" placeholder=\"https://example.com\"></div><div class=\"frm__inp\"><label>Стационарный телефон</label><input ng-model=\"supplier.landline\"></div><div class=\"frm__but\"><button class=\"app-button\" ng-disabled=\"update_progress\" type=\"submit\">Сохранить</button> <span ng-show=\"update_progress\">сохранение... </span><span ng-show=\"is_saved\">сохранено успешно</span></div></form></div>");
  $templateCache.put("splr-manager/vkid/vkid-edt.tpl.html", "<form class=\"frm\" name=\"vkidForm\" ng-submit=\"updateVkid(supplier.id, supplier.vk_id)\"><div class=\"frm__inp\"><label>Vkontakte id (число)</label><input ng-model=\"supplier.vk_id\" placeholder=\"7654321\"></div><div class=\"frm__but\"><button class=\"app-button\" ng-disabled=\"update_progress\" type=\"submit\">Сохранить</button> <span ng-if=\"update_progress\">сохранение... </span><span ng-if=\"is_saved\">сохранено успешно</span></div></form>");
  $templateCache.put("splr-manager/work-creator/work-creator-edt.tpl.html", "<div class=\"work-creator-edt\"><form name=\"uform\"><div><button class=\"btn-video-link\" ng-click=\"addVideoLink()\">добавить ссылку на видео</button></div><div class=\"txt-or\">или</div><div class=\"drop-box\" ngf-select ngf-drop ngf-pattern=\"\'image/jpeg,image/png\'\" ngf-accept=\"\'image/jpeg,image/png\'\" ng-model=\"files\" ngf-multiple=\"true\" ngf-min-height=\"200\" ngf-min-width=\"200\" ngf-max-height=\"4000\" ngf-max-width=\"4000\" ngf-max-size=\"5MB\" ngf-max-files=\"10\">добавить фотографии...</div><div class=\"err-selection\" ng-if=\"!uform.$valid\"><div>некоторые файлы не удалось добавить:<ul><li ng-if=\"uform.$error.minHeight\">минимальная высота: 200px</li><li ng-if=\"uform.$error.minWidth\">минимальная ширина: 200px</li><li ng-if=\"uform.$error.maxHeight\">максимальная высота: 4000px</li><li ng-if=\"uform.$error.maxWidth\">максимальная ширина: 4000px</li><li ng-if=\"uform.$error.pattern\">разрешённые типы файлов: png, jpg (jpeg)</li></ul><span ng-if=\"uform.$error.maxSize\">максимальный размер файла: 5МБ</span></div><div ng-if=\"uform.$error.maxFiles\">можно выбрать до 10 файлов за один раз</div></div><div ng-if=\"files\"><div class=\"thumbnail-wrap\" ng-repeat=\"fl in files\"><div class=\"thumbnail-progress\" ng-if=\"progress && $index === 0\">загрузка {{progress}}%</div><div><img class=\"thumbnail\" ngf-thumbnail=\"fl\"></div><div class=\"thumbnail-name\">{{ fl.name }}</div><div ng-if=\"!progress\"><button class=\"button-del\" ng-click=\"removePreFile(files, $index)\"><i class=\"fa fa-trash\"></i></button></div></div></div><button class=\"app-button\" type=\"submit\" ng-if=\"files && files.length && !progress\" ng-click=\"submit(uform, files)\">Добавить фотографии</button></form></div>");
  $templateCache.put("splr-manager/work-item/work-item-edt.tpl.html", "<div class=\"work-item-edt\"><div ng-if=\"servWork.main_video\"><div ytb-video data-yid=\"{{servWork.main_video}}\"></div></div><div class=\"ximg\" ng-if=\"servWork.preview_img\"><a ui-sref=\"byt.mediaItem({media_id:servWork.id})\"><img class=\"ximg__img\" ng-if=\"is_show\" ng-src=\"{{servWork.preview_img}}\"></a></div><div class=\"created\">{{servWork.created*1000 | date:\'dd.MM.yyyy\'}}</div></div>");
  $templateCache.put("splr-manager/work-list/work-list-edt.tpl.html", "<div class=\"work-list-edt\"><div ng-if=\"canInsert\"><div work-creator-edt data-serv-rubric-id=\"servRubricId\" data-serv-rubric-name=\"servRubricName\" data-master-profile-id=\"masterProfileId\" data-arr-serv-work=\"arr_serv_work\"></div></div><div ng-if=\"arr_serv_work\"><div class=\"list-item\" ng-repeat=\"wrk in arr_serv_work\"><div work-item-edt data-serv-work=\"wrk\" data-vpos=\"vpos\"></div><div ng-if=\"canDelete\"><button class=\"button-del\" title=\"удалить работу\" ng-click=\"deleteServWork(wrk.id, servRubricId)\"><i class=\"fa fa-trash\"></i></button></div></div></div><div class=\"err-msg\" ng-if=\"err_arr\">{{err_arr.msg}}</div><div ng-if=\"!err_arr && !arr_serv_work\">...</div></div>");
  $templateCache.put("agglo-item/spec-item/rubric-item/blog-links.tpl.html", "<div class=\"blog-links\" ng-if=\"rubricArticles.length\"><div class=\"blog-links__header\">Статьи по теме</div><ul><li class=\"blog-links__item\" ng-repeat=\"article in rubricArticles\"><a target=\"_blank\" ng-href=\"{{article.lnk}}\">{{article.ttl}} <sup><i class=\"fa fa-external-link\"></i></sup></a></li></ul></div>");
  $templateCache.put("agglo-item/spec-item/rubric-item/outer-links.tpl.html", "<div class=\"outer-links\"><div class=\"outer-links__header\">Мастера и салоны красоты</div><div class=\"outer-links__item\"><a ui-sref=\"byt.aggloItem.specItem.rubricItem.prtfView\" title=\"Все фотографии {{curRubric.case_gen}}\"><i class=\"fa fa-picture-o\"></i><br><span>в галерее</span></a></div><div class=\"outer-links__item\"><a ui-sref=\"byt.aggloItem.specItem.rubricItem.tblView\" title=\"Каталог мастеров и салонов красоты {{curRubric.name}}\"><i class=\"fa fa-list\"></i><br><span>в каталоге</span></a></div></div>");
  $templateCache.put("agglo-item/spec-item/rubric-item/rubric-item.tpl.html", "<div class=\"full-height\" ng-if=\"cur_rubric\" ui-view=\"rubricItemContent\"></div><div ng-if=\"is_prg\"><div ng-if=\"!cur_rubric && !err_cur_rubric\"><div class=\"pdng text-center\">загрузка услуги...</div></div></div><div ng-if=\"err_cur_rubric\"><div class=\"err-msg\" ng-bind=\"err_cur_rubric.msg\"></div><div class=\"err-alt\"><a ng-href=\"{{home_href}}\">Перейти к выбору услуг в городе {{cur_agglo.local_name}}</a></div></div>");
  $templateCache.put("agglo-item/spec-item/rubric-item/similar-links.tpl.html", "<div class=\"similar-links\"><div class=\"similar-links__header\">Возможно вас заинтересует</div><div><div class=\"similar-links__item\" ng-repeat=\"rbr in similarRubrics\"><a ui-sref=\"byt.aggloItem.specItem.rubricItem.tblView({agglo_local_name: curAgglo.local_name, spec_name: rbr.item.serv_group_name, rubric_name: rbr.item.name})\">{{rbr.item.name}}</a></div></div></div>");
  $templateCache.put("agglo-item/spec-item/rubric-list/rubric-list.tpl.html", "<div data-app-toolbar data-agglo-name=\"agglo.local_name\" data-spec-name=\"spec.name\"></div><div class=\"app-content rubric-list\"><h1 class=\"rubric-list__header\">{{spec.name}} в {{agglo.case_prepositional}}</h1><div ng-if=\"allRubrics\"><ul class=\"rubric-list__list pure-g\" ng-if=\"rubrics.length > 0\"><li class=\"pure-u-1 pure-u-sm-1-2 pure-u-md-1-4\" ng-repeat=\"item in rubrics\"><div class=\"rubric-list__item-wrap\"><a class=\"rubric-list__item-link\" ng-href=\"{{calcHref(item.name, \'tblView\')}}\">{{item.name}}</a><div class=\"rubric-list__item-counter\">{{item.count_master_serv}}</div></div></li></ul><div class=\"err-msg\" ng-if=\"rubrics.length === 0\">Не найдено услуг в городе {{agglo.local_name}} по специальности {{spec.name}}</div><div class=\"mrgn text-center\" ng-if=\"spec.id === \'hair\'\"><a ui-sref=\"byt.quizItem.qstnList({quiz_ttl: \'какая-прическа-мне-подойдет\'})\"><span class=\"fa fa-question-circle\"></span> Тест: какая прическа мне подойдет</a></div></div><div ng-if=\"is_prg\"><div ng-if=\"!allRubrics && !err_rubrics\"><div class=\"text-center\"><div class=\"xprogress\"><span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span></div></div></div></div><div ng-if=\"err_rubrics\"><div class=\"err-msg\" ng-bind=\"err_rubrics.msg\"></div></div><div data-app-footer></div></div>");
  $templateCache.put("splr/main/splr-contact/splr-contact.tpl.html", "<div class=\"clearfix\"><div ng-if=\"ctct.type === \'phone\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-mobile\"></span></div><div class=\"ctct__text-wrap\"><div><span ng-show=\"is_phone_open\"><a itemprop=\"telephone\" ng-href=\"tel:{{ctct.value}}\" ng-bind=\"ctct.value\"></a> </span><span ng-show=\"!is_phone_open\" style=\"cursor:pointer\" analytics-on=\"click\" analytics-category=\"contact\" analytics-event=\"contact-phone\" ng-click=\"is_phone_open = true\"><span ng-bind=\"ctct.value.substr(0, 5)\"></span> <span>...</span> <span class=\"ctct__show-link\">показать</span></span></div><div class=\"ctct__text-sub\">мобильный телефон <span ng-bind=\"ctct.alias\"></span> <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'landline\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-phone\"></span></div><div class=\"ctct__text-wrap\"><div><span ng-show=\"is_landline_open\"><span ng-bind=\"ctct.value\"></span> </span><span ng-show=\"!is_landline_open\" style=\"cursor:pointer\" analytics-on=\"click\" analytics-category=\"contact\" analytics-event=\"contact-landline\" ng-click=\"is_landline_open = true\"><span ng-bind=\"ctct.value.substr(0, 5)\"></span> <span>...</span> <span class=\"ctct__show-link\">показать</span></span></div><div class=\"ctct__text-sub\">стационарный телефон <span ng-bind=\"ctct.alias\"></span> <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'whatsapp\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-whatsapp\"></span></div><div class=\"ctct__text-wrap\"><div><span ng-show=\"is_whatsapp_open\"><a ng-href=\"tel:{{ctct.value}}\" ng-bind=\"ctct.value\"></a> </span><span ng-show=\"!is_whatsapp_open\" style=\"cursor:pointer\" analytics-on=\"click\" analytics-category=\"contact\" analytics-event=\"contact-whatsapp\" ng-click=\"is_whatsapp_open = true\"><span ng-bind=\"ctct.value.substr(0, 5)\"></span> <span>...</span> <span class=\"ctct__show-link\">показать</span></span></div><div class=\"ctct__text-sub\">whatsapp <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'viber\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-phone-square\"></span></div><div class=\"ctct__text-wrap\"><div><span ng-show=\"is_viber_open\"><a ng-href=\"tel:{{ctct.value}}\" ng-bind=\"ctct.value\"></a> </span><span ng-show=\"!is_viber_open\" style=\"cursor:pointer\" analytics-on=\"click\" analytics-category=\"contact\" analytics-event=\"contact-viber\" ng-click=\"is_viber_open = true\"><span ng-bind=\"ctct.value.substr(0, 5)\"></span> <span>...</span> <span class=\"ctct__show-link\">показать</span></span></div><div class=\"ctct__text-sub\">viber <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'fax\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-fax\"></span></div><div class=\"ctct__text-wrap\"><div itemprop=\"faxNumber\" ng-bind=\"ctct.value\"></div><div class=\"ctct__text-sub\">факс <span ng-bind=\"ctct.alias\"></span> <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'email\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-envelope\"></span></div><div class=\"ctct__text-wrap\"><div><span ng-show=\"is_email_open\"><span itemprop=\"email\" ng-bind=\"ctct.value\"></span> </span><span ng-show=\"!is_email_open\" style=\"cursor:pointer\" analytics-on=\"click\" analytics-category=\"contact\" analytics-event=\"contact-email\" ng-click=\"is_email_open = true\"><span ng-bind=\"ctct.value.substr(0, 7)\"></span> <span>...</span> <span class=\"ctct__show-link\">показать</span></span></div><div class=\"ctct__text-sub\">email <span ng-bind=\"ctct.alias\"></span> <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'skype\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-skype\"></span></div><div class=\"ctct__text-wrap\"><div>{{ctct.alias}}</div><div class=\"ctct__text-sub\">Skype <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'icq\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-comments\"></span></div><div class=\"ctct__text-wrap\"><div ng-bind=\"ctct.value\"></div><div class=\"ctct__text-sub\">icq <span ng-bind=\"ctct.alias\"></span> <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'jabber\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-comments-o\"></span></div><div class=\"ctct__text-wrap\"><div ng-bind=\"ctct.value\"></div><div class=\"ctct__text-sub\">jabber <span ng-bind=\"ctct.alias\"></span> <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'website\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-globe\"></span></div><div class=\"ctct__text-wrap\"><a target=\"_blank\" rel=\"nofollow\" ng-if=\"ctct.value\" analytics-on analytics-category=\"contact\" analytics-event=\"contact-website\" ng-href=\"{{ctct.value}}\">{{ctct.alias}} <sup><span class=\"fa fa-external-link\"></span></sup> </a><span ng-if=\"!ctct.value\">нет данных</span><div class=\"ctct__text-sub\">веб-сайт <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'vkprofile\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-vk\"></span></div><div class=\"ctct__text-wrap\"><a target=\"_blank\" rel=\"nofollow\" analytics-on analytics-category=\"contact\" analytics-event=\"contact-vkprofile\" ng-href=\"{{ctct.value}}\">{{ctct.alias}} <sup><span class=\"fa fa-external-link\"></span></sup></a><div class=\"ctct__text-sub\">ВКонтакте (профиль) <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'vkontakte\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-vk\"></span></div><div class=\"ctct__text-wrap\"><a target=\"_blank\" rel=\"nofollow\" analytics-on analytics-category=\"contact\" analytics-event=\"contact-vkn\" ng-href=\"{{ctct.value}}\">{{ctct.alias}} <sup><span class=\"fa fa-external-link\"></span></sup></a><div class=\"ctct__text-sub\">ВКонтакте (группа) <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'odnoklassniki\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-users\"></span></div><div class=\"ctct__text-wrap\"><a target=\"_blank\" rel=\"nofollow\" analytics-on analytics-category=\"contact\" analytics-event=\"contact-odnoklassniki\" ng-href=\"{{ctct.value}}\"><span ng-bind=\"ctct.alias\"></span></a><div class=\"ctct__text-sub\">Одноклассники <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'facebook\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-facebook\"></span></div><div class=\"ctct__text-wrap\"><a target=\"_blank\" rel=\"nofollow\" analytics-on analytics-category=\"contact\" analytics-event=\"contact-fbk\" ng-href=\"{{ctct.value}}\"><span ng-bind=\"ctct.alias\"></span></a><div class=\"ctct__text-sub\">Facebook <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'instagram\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-instagram\"></span></div><div class=\"ctct__text-wrap\"><a target=\"_blank\" rel=\"nofollow\" itemprop=\"sameAs\" aria-label=\"instagram\" analytics-on analytics-category=\"contact\" analytics-event=\"contact-nstg\" ng-href=\"{{ctct.value}}\">{{ctct.alias}} <sup><span class=\"fa fa-external-link\"></span></sup></a><div class=\"ctct__text-sub\">Instagram <span ng-bind=\"ctct.comment\"></span></div></div></div><div ng-if=\"ctct.type === \'twitter\'\"><div class=\"ctct__icon-wrap\"><span class=\"fa fa-twitter\"></span></div><div class=\"ctct__text-wrap\"><span ng-bind=\"ctct.alias\"></span><div class=\"ctct__text-sub\">Twitter <span ng-bind=\"ctct.comment\"></span></div></div></div></div>");
  $templateCache.put("splr/main/splr-serv/splr-serv.tpl.html", "<div class=\"splr-serv\" itemscope itemtype=\"http://schema.org/Service\"><div ng-if=\"isEditable\" class=\"splr-serv__edit\"><a title=\"Редактировать услугу и фото\" ui-sref=\"byt.splrManager.servItem({supplier_id: msrv.master_profile_id, id: msrv.id})\"><i class=\"fa fa-edit\"></i></a></div><h2 class=\"splr-serv__name\" ng-bind=\"msrv.serv_rubric_name\" itemprop=\"name\"></h2><div class=\"splr-serv__price-wrap\" ng-if=\"msrv.price_from || msrv.price_to\"><span ng-if=\"msrv.price_from\">от <span class=\"splr-serv__price\">{{msrv.price_from}}</span> </span><span ng-if=\"msrv.price_to\">до <span class=\"splr-serv__price\">{{msrv.price_to}}</span> </span>руб.</div><div><a class=\"splr-serv__city-spec-href\" ng-href=\"{{citySpecHref}}\">показать всех мастеров</a></div></div>");
  $templateCache.put("agglo-item/spec-item/rubric-item/prtf-view/prtf-item.tpl.html", "<div class=\"prtf-item\"><a class=\"prtf-item__img-wrap\" ng-if=\"pw.preview_img\" ng-href=\"{{workInfoLink}}\" ng-click=\"saveHash(pw.id)\"><span class=\"back-img back-grey prtf-item__img\" ng-style=\"{\'background-image\': \'url({{pw.preview_img}})\'}\" ng-if=\"pw.is_show\"></span></a><div class=\"prtf-item__img-wrap\" ng-if=\"pw.main_video\"><div class=\"back-img back-grey prtf-item__img\" ng-if=\"pw.is_show\" ytb-video data-yid=\"{{pw.main_video}}\"></div></div><div class=\"prtf-item__name-wrap\" ng-if=\"pw.preview_img\"><a class=\"prtf-item__master-link\" ng-href=\"{{masterInfoLink}}\" ng-click=\"saveHash(pw.id)\" analytics-on analytics-category=\"masterinfo\" analytics-event=\"masterinfo-prtf\">{{pw.master_profile_name}}</a></div></div>");
  $templateCache.put("agglo-item/spec-item/rubric-item/prtf-view/prtf-view.tpl.html", "<div data-app-toolbar data-agglo-name=\"cur_agglo.local_name\" data-spec-name=\"cur_spec.name\" data-rubric-name=\"cur_rubric.name\" data-rview-id=\"rview_id\" data-rview-name=\"rview_name\"></div><div class=\"app-content\" tabindex=\"-1\" app-scroll-watcher app-vpos=\"vpos\"><div ng-if=\"arr_prtf_work\"><div><div><h1 class=\"page-header\" data-ng-bind=\"page_header\"></h1><div class=\"mrgn\"><div ng-if=\"arr_prtf_work.length === 0\">По данному запросу не найдены фотографии работ.</div><div ng-if=\"arr_prtf_work.length > 0\">найдено: <strong ng-bind=\"arr_prtf_work.length\"></strong></div></div></div></div><div ng-if=\"arr_prtf_work.length > 0\"><ul class=\"pure-g\"><li class=\"pure-u-1 pure-u-sm-1-2 pure-u-md-1-4\" ng-repeat=\"pw in arr_prtf_work\" on-finish-render=\"servListRepeatFinished\" id=\"work{{pw.id}}\"><div class=\"prtf-view-block\" prtf-item-drct data-pw=\"pw\" data-rubric-name=\"cur_rubric.name\"></div></li></ul><div class=\"mrgn\"><div class=\"text-center pdng\"><div class=\"text-center pdng\"><a ui-sref=\"byt.aggloItem.specItem.rubricItem.tblView\">Каталог мастеров <span ng-if=\"cur_rubric.case_dat\">по {{cur_rubric.case_dat}}</span></a></div></div></div><div class=\"prtf-view__bottom\"><div app-similar-links data-cur-agglo=\"cur_agglo\" data-similar-rubrics=\"similar_rubrics\"></div><div app-outer-links data-cur-agglo=\"cur_agglo\" data-cur-spec=\"cur_spec\" data-cur-rubric=\"cur_rubric\"></div><div app-blog-links data-rubric-articles=\"rubric_articles\"></div><div class=\"pdng\"><a ui-sref=\"byt.quizItem.qstnList({quiz_ttl: \'какая-прическа-мне-подойдет\'})\"><span class=\"fa fa-question-circle\"></span> Тест: какая прическа мне подойдет</a></div><div class=\"pdng\"><a ng-href=\"{{home_href}}\"><span class=\"fa fa-list\"></span> Вернуться к выбору услуг</a></div></div></div><div ng-if=\"!arr_prtf_work && !err_arr_prtf_work\"><div class=\"pdng text-center\">загрузка фото...</div></div><div ng-if=\"err_arr_prtf_work\"><div class=\"pdng\"><span ng-bind=\"err_arr_prtf_work.msg\"></span></div></div><div data-app-footer></div></div></div>");
  $templateCache.put("agglo-item/spec-item/rubric-item/tbl-view/tbl-view.tpl.html", "<div data-app-toolbar data-agglo-name=\"cur_agglo.local_name\" data-spec-name=\"cur_spec.name\" data-rubric-name=\"cur_rubric.name\" data-rview-id=\"rview_id\" data-rview-name=\"rview_name\"></div><div class=\"app-content tbl-view\" tabindex=\"-1\" app-scroll-watcher app-vpos=\"vpos\"><div class=\"full-height\"><div ng-if=\"arr_supplier\" class=\"pdng\"><div><div><h1 class=\"tbl-view__header\" ng-bind=\"page_header\"></h1><div class=\"tbl-view__state\"><div ng-if=\"arr_supplier.length === 0\">По данному запросу в каталоге не найдено мастеров. <a ng-href=\"{{home_href}}\">выберите другую услугу</a>. Каталог мастеров пополняется с каждым днём.</div><div ng-if=\"arr_supplier.length > 0\">Найдено: <strong ng-bind=\"arr_supplier.length\"></strong></div></div></div></div><div class=\"tbl-view__list\"><div itemscope itemtype=\"http://schema.org/BeautySalon\" ng-repeat=\"supPart in arr_supplier\" on-finish-render=\"supplierListRepeatFinished\" id=\"supplier{{supPart.id}}\"><div class=\"tbl-view__item\"><div app-tbl-item data-sup-item=\"supPart\" data-city-name=\"cur_agglo.local_name\" data-is-editable=\"sessData.is_editor\"></div><div app-work-gallery app-sup-item=\"supPart\" app-work-scope=\"supPart.work_scope\" app-wrap-elem-id=\"supPart.id\"></div></div><div class=\"tbl-view__divider\" ng-if=\"$index > 0 && $index%5 === 0 && $index < arr_supplier.length - 5\"><div app-outer-links ng-if=\"$index%2 === 0\" data-cur-agglo=\"cur_agglo\" data-cur-spec=\"cur_spec\" data-cur-rubric=\"cur_rubric\"></div><div app-similar-links ng-if=\"$index%2 !== 0\" data-cur-agglo=\"cur_agglo\" data-similar-rubrics=\"similar_rubrics\"></div></div></div></div><div class=\"tbl-view__bottom\"><div app-similar-links data-cur-agglo=\"cur_agglo\" data-similar-rubrics=\"similar_rubrics\"></div><div app-outer-links data-cur-agglo=\"cur_agglo\" data-cur-spec=\"cur_spec\" data-cur-rubric=\"cur_rubric\"></div><div app-blog-links data-rubric-articles=\"rubric_articles\"></div><div class=\"mrgn text-center\" ng-if=\"cur_spec.id === \'hair\'\"><a ui-sref=\"byt.quizItem.qstnList({quiz_ttl: \'какая-прическа-мне-подойдет\'})\"><span class=\"fa fa-question-circle\"></span> Тест: какая прическа мне подойдет</a></div><div class=\"text-center pdng\"><a ng-href=\"{{home_href}}\"><span class=\"fa fa-list\"></span> Вернуться к выбору услуг</a></div></div></div><div ng-if=\"!arr_supplier && !err_msg\"><div class=\"text-center pdng\">загрузка информации...</div></div><div ng-if=\"err_msg\"><div class=\"err-msg\" ng-bind=\"err_msg\"></div></div><div data-app-footer></div></div></div>");
}]);