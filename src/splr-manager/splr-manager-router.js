(function(angular){
  'use strict';

  /* eslint quotes: 0 */

  var deps = [
    'myApp.SplrProfileEdtController',
    'myApp.SplrServListEdtController',
    'myApp.SplrServItemEdtController',
    'myApp.SplrAggloEdtController',
    'myApp.SplrSocialEdtController',
    'myApp.SplrRemovalController',

    'myApp.servCreatorEdt',
    'myApp.workCreatorEdt',
    'myApp.workItemEdt',
    'myApp.workListEdt'
  ];

  var xpo = function(){

    var initRouter = function(appProvider){

      var rootState = "byt.splrManager.";
      // config is executed once at app init
      //console.log(rootState);

      appProvider
        .state(rootState + 'profile', {
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
        })

        .state(rootState + "servList", {
          url: "/servs",
          views: {
            managerContent: {
              templateUrl: "splr-manager/serv-list/serv-list-edt.tpl.html",
              controller: 'SplrServListEdtController'
            }
          }
        })

        .state(rootState + "servCreator", {
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
            q_id: [
              '$stateParams',
              function($stateParams){
                return $stateParams.id;
              }
            ]
          }
        })

        .state(rootState + "address", {
          url: "/address",
          views: {
            managerContent: {
              templateUrl: "splr-manager/address/agglo-edt.tpl.html",
              controller: 'SplrAggloEdtController'
            }
          }
        })

        .state(rootState + "social", {
          url: "/socials",
          views: {
            managerContent: {
              templateUrl: "splr-manager/social/social-edt.tpl.html",
              controller: 'SplrSocialEdtController'
            }
          }
        })

        .state(rootState + "removal", {
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

  angular.module('myApp.mngrRouter', deps)
    .factory('mngrRouter', [xpo]);

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
