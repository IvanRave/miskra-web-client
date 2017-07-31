// All route params injected only here
// except splr-manager-router
// Do not send StateParams or RouteParams objects to controllers
(function(angular){
  'use strict';
  /* eslint quotes: 0 */

  var deps = [
    'ui.router',

    // child routers
    'myApp.mngrRouter',
    
    'myApp.WlcController',
    'myApp.AggloItemController',
    'myApp.AggloListController',
    //'myApp.SpecListController',
    'myApp.specListDrct',
    'myApp.rubricListDrct',
    'myApp.aggloListDrct',
    'myApp.mediaItemDrct',
    'myApp.breadcrumbDrct',
    'myApp.appFooter',
    'myApp.appToolbar',
    'myApp.AppMapController',
    
    
    'myApp.SpecItemController',
    // ideally: this controllers and states need to move
    //          to child folders 
    'myApp.RubricItemController',
    'myApp.TblViewController',
    'myApp.PrtfViewController',
    'myApp.OfferListController',

    'myApp.SplrLoginController',
    'myApp.SplrItemController',
    'myApp.SplrMainController',    
    // 'myApp.ServItemController',
    // 'myApp.WorkItemController',
    
    'myApp.SplrManagerController',
    
    'myApp.userStatusDrct',
    'myApp.AppController',

    //    'myApp.AggloTblViewController',

    'myApp.OauthLoginController',

    // quiz
    'myApp.QuizItemController',
    'myApp.qstnListDrct',
    'myApp.lgr'
    // 'myApp.qresItemDrct'
  ];

  // var mediaController = function(scp, media_id){
  //     scp.media_id = media_id;    
  // };

  // mediaController.$inject = ['$scope', 'media_id'];
  
  var xpo = function($urlRouterProvider,
                     $stateProvider,
                     $locationProvider,
                     mngrRouterProvider){
    
    $locationProvider
      .html5Mode(true)
      .hashPrefix('!');
    // ! для совместимости с браузерами,
    //   не поддерживающими javascript
    
    var baseRoute = ''; //'/www-dev',
    var basePath = '/'; // was '/welcome'

    // executed after all child router's config executed
    //console.log('baseRouter');

    // setup an abstract state for the tabs directive
    // http://angular-ui.github.io/ui-router/site/
    $stateProvider    
      .state('byt', {
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
          q_ll: ['$stateParams', function($stateParams){
            return $stateParams.ll;
          }],
          q_z: ['$stateParams',    function($stateParams){
            return $stateParams.z;
          }],
          q_g: ['$stateParams',    function($stateParams){
            return $stateParams.g;
          }],
          q_spec: ['$stateParams',    function($stateParams){
            return $stateParams.spec;
          }]
        }
      })


      .state('byt.mediaItem', {
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
            template: `<div class="full-height" ng-if="media_id">
<div class="full-height" data-media-item-drct data-media-id="{{media_id}}">
</div>
</div>`,
            controller: ['$scope', 'lgr', 'media_id', function($scope, lgr, media_id){
              if (!media_id){
                lgr.crit('errMediaItem', 'no media id');
              } else {
                $scope.media_id = media_id;
              }
            }]
          }
        },
        resolve: {
          media_id: [
            '$stateParams',
            function($stateParams){
              // this resolve executes before parent controllers
              return $stateParams.media_id;
            }
          ]
        }
      })

      .state('byt.quizItem', {
        url: '/q/{quiz_ttl:string}',
        'abstract': true,
        views: {
          'appContent': {
            templateUrl: 'quiz-item/quiz-item.tpl.html',
            controller: 'QuizItemController'
          }
        },
        resolve: {
          quiz_ttl: [
            '$stateParams',
            ($stateParams) => $stateParams.quiz_ttl
          ]
        }
      })
    
      .state('byt.quizItem.qstnList', {
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
          'appContent':{
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
          q_agglo_local_name: [
            '$stateParams',
            function($stateParams){
              // this resolve executes before parent controllers
              return $stateParams.agglo_local_name;
            }
          ]      
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
      })

      .state("byt.aggloItem.specItem", {
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
          q_spec_name: [
            '$stateParams',
            function($stateParams){
              return $stateParams.spec_name;

              // do not check it: it is not necessary to load
              //   this spec before using.
              //   Load it after resolving: in controller body
            }
          ]
        }
      })

      .state("byt.aggloItem.specItem.rubricList", {
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
          q_rubric_name: ['$stateParams', function($stateParams){
            // all - to show all rubrics
            return $stateParams.rubric_name;
          }]
        }
      })

    // first - used 301 redirect on server side
      .state("byt.aggloItem.specItem.rubricItem.prtfPrev", {
        url: "/портфолио",
        resolve: {
          rdr: ['$location',
                '$state',
                '$stateParams',
                function($location, $state, $stateParams){
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
          q_id: [
            '$stateParams',
            function($stateParams){
              // this resolve executes before parent controllers
              // console.log('supplier resolve', $stateParams.supplier_id);
              return +$stateParams.supplier_id;
            }
          ]
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
      })

    
      .state("byt.splrItem", {
        url: "/id{supplier_id:[0-9]{6,50}}?hash&tpe&name",
        'abstract': true,
        views: {
          'appContent': {
            templateUrl: "splr/splr-item.tpl.html",
            controller: 'SplrItemController'
          }
        },
        resolve: {
          q_name: ['$stateParams', function($stateParams){
            return $stateParams.name;
          }],
          q_id: [
            '$stateParams',
            function($stateParams){
              // this resolve executes before parent controllers
              // console.log('supplier resolve', $stateParams.supplier_id);
              // convert to integer
              return +$stateParams.supplier_id;
            }
          ],          
          q_hash: ['$stateParams', function($stateParams){
            return $stateParams.hash;
          }],
          q_tpe: ['$stateParams', function($stateParams){
            return $stateParams.tpe;
          }]
        }
      })

      .state("byt.splrItem.main", {
        url: "",
        views: {
          'splrItemContent': {
            templateUrl: "splr/main/splr-main.tpl.html",
            controller: 'SplrMainController'
          }
        }
      })

      .state("byt.splrItemF", {
        url: "/fid{supplier_id:[0-9]{6,50}}?hash&tpe&name",
        'abstract': true,
        views: {
          'appContent': {
            templateUrl: "splr/splr-item.tpl.html",
            controller: 'SplrItemController'
          }
        },
        resolve: {
          q_name: ['$stateParams', function($stateParams){
            return $stateParams.name;
          }],
          q_id: [
            '$stateParams',
            function($stateParams){
              // this resolve executes before parent controllers
              // console.log('supplier resolve', $stateParams.supplier_id);
              return +$stateParams.supplier_id;
            }
          ],          
          q_hash: ['$stateParams', function($stateParams){
            return $stateParams.hash;
          }],
          q_tpe: ['$stateParams', function($stateParams){
            return $stateParams.tpe;
          }]
        }
      })

      .state("byt.splrItemF.main", {
        url: "",
        views: {
          'splrItemContent': {
            templateUrl: "splr/main/splr-main.tpl.html",
            controller: 'SplrMainController'
          }
        }
      })

      .state("byt.index", {
        url: "/index.html",
        resolve: {
          rdr: ['$location',
                '$state',
                '$stateParams',
                function($location, $state, $stateParams){
                  $location.url($state.href("byt.welcome", $stateParams));
                }]
        }
      })

      .state("byt.indexvkn", {
        url: "/index-vkn.html",
        resolve: {
          rdr: ['$location',
                '$state',
                '$stateParams',
                function($location, $state, $stateParams){
                  $location.url($state.href("byt.welcome", $stateParams));
                }]
        }
      })

      .state("byt.indexfbk", {
        url: "/index-fbk.html",
        resolve: {
          rdr: ['$location',
                '$state',
                '$stateParams',
                function($location, $state, $stateParams){
                  $location.url($state.href("byt.welcome", $stateParams));
                }]
        }
      });


    // console.log('mngrRouter', mngrRouterProvider.$get());
    // http://stackoverflow.com/questions/17485900/injecting-dependencies-in-config-modules-angularjs
    mngrRouterProvider.$get().initRouter($stateProvider);    

    $stateProvider
      .state("byt.otherwise", {
        // Special syntax for catch all.
        url: "/{path:.*}",
        views: {
          'appContent': {
            template: '<div class="err-msg">Запрашиваемая страница не найдена: {{q_path}}</div><div class="err-alt"><a href="/">Перейти на главную</a></div>',
            controller: [
              '$scope',
              'readiness',
              'q_path', function(
                $scope,
                readiness,
                q_path
              ){
                $scope.q_path = q_path;
                // <meta name="prerender-status-code" content="404">
                readiness.notFound();
                
              }]
          }
        },
        resolve: {
          q_path: ['$stateParams', function($stateParams){
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

  angular.module('myApp.routeConfig', deps)
    .config([
      '$urlRouterProvider',
      '$stateProvider',
      '$locationProvider',
      'mngrRouterProvider',
      xpo]);
  
})(window.angular);
