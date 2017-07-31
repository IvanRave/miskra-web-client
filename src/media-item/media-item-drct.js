(function(angular, APPCONF){
  'use strict';

  class Xpo{
    constructor(
      $scope,
      $location,
      $state,
      lgr,
      apimas,
      aggloItemRepo,
      servGroupRepo,
      readiness
    ){

      if (!$scope.mediaId){
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

      $scope.is_vk_share = !!(window.VK);

      $scope.is_vk_like = !!(window.VK);

      // fb, vk, ok, etc.
      // share, wall, like, etc.

      var cbkErrLoad = function(err){
        switch (err.status){
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

      var calcServGroupName = function(id){
        if (!$scope.arr_serv_group) {
          return null;
        }

        var servGroup = $scope.arr_serv_group.filter((item) => {
          return item.id === id;
        })[0];

        if (!servGroup){
          return null;
        }

        return servGroup.name;
      };

      $scope.calcHrefRubric = function(aggloLocalName, servGroupId, servRubricName){

        return $state.href('byt.aggloItem.specItem.rubricItem.tblView', {
          agglo_local_name: aggloLocalName,
          spec_name: calcServGroupName(servGroupId),
          rubric_name: servRubricName
        });
      };

      var readyAll = function(){
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

        angular.forEach($scope.sw.arr_serv_rubric, (rbr) => {
          if ((metaDscr.length + rbr.name.length) < 150){
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
        if ($scope.sw.main_serv_rubric){
          metaTtl += ' - ' + $scope.sw.main_serv_rubric.name;
        }
        metaTtl += ' - ' + $scope.sw.master_profile_name;

        if ($scope.sw.city_name) {
          metaTtl += ' - ' + $scope.sw.city_name;
        }

        // add master info to title and description
        readiness.ok(metaTtl,
                     metaDscr,
                     $state.href('byt.mediaItem', {
                       media_id: $scope.sw.id
                     }));

        //ttl: 'Фото {serv_rubric_name} - {name} - работа {serv_work_id}',
        //dscr: 'Фотография {serv_rubric_name} от мастера / салона красоты: {name}. Идентификатор работы: {serv_work_id}'
      };


      var scopeOther = function(){
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

      var attachAgglo = function(){
        var ma = $scope.sw.master_address;
        if (!ma){
          // nothing attach
          return null;
        }

        return aggloItemRepo.retrieveById(ma.geo_district_id)
          .then(function(agg){
            $scope.sw.city_name = agg.local_name;
            $scope.sw.city_name_genitive = agg.case_genitive;
            $scope.sw.city_name_prepositional = agg.case_prepositional;
          })
          .catch((err) => {
            // ignore err, send to admin
            lgr.crit('aggloItemRetrieve', 'from media-item', {
              msg: err.message
            }, err.stack);
          });
      };

      // load info for a work: description, prices, etc.
      // description already loaded for tblView, masterView
      var loadServWork = function(){
        return apimas.sendGet('/work/get-item', {
          id: $scope.mediaId // servWorkId
        }).then(function(r){
          // if not exists - 404 error in catch block
          $scope.sw = r;

          // $scope.sw.embed_link = $sce.trustAsResourceUrl($scope.sw.side_link + 'embed/');
        });
        // .then(translateRubric)
        // .then(readyAll)
      };

      var loadServGroups = function(){
        return servGroupRepo.retrieveData()
          .then(function(arr){
            $scope.arr_serv_group = arr;
          });
      };

      var loadWorkRubrics = function(){
        return apimas.sendGet('/work/get-rubrics', {
          serv_work_id: $scope.sw.id,
          locale_id: 'ru'
        })
          .then(function(r){
            $scope.sw.arr_serv_rubric = r.arr_serv_rubric;
          })
          .catch(function(e){
            // skip errors from work rubrics:
            // it is a second priority on a page

            // just set to empty
            $scope.sw.arr_serv_rubric = [];

            lgr.crit('mediaGetRubrics', 'loadWorkRubrics', {
              msg: e.message
            }, e.stack);
          });
      };

      loadServWork()
        .then(loadServGroups)
        .then(loadWorkRubrics)
        .then(attachAgglo)
        .then(scopeOther)
        .then(readyAll)
        .catch(cbkErrLoad);
    }
  }

  var drct = function(){
    return {
      restrict: 'A',
      scope: {
        mediaId: '@'
      },
      templateUrl: 'media-item/media-item.tpl.html',
      controller: [
        '$scope',
        '$location',
        '$state',
        'lgr',
        'apimas',
        'aggloItemRepo',
        'servGroupRepo',
        'readiness',
        Xpo
      ]
    };
  };

  angular.module('myApp.mediaItemDrct', [
    'myApp.ytbVideo',
    'myApp.apimas',
    'myApp.readiness',
    'myApp.appVkLike',
    'myApp.fullSizeImg',
    'myApp.aggloItemRepo',
    'myApp.servGroupRepo'
  ])
    .directive('mediaItemDrct', [
      drct
    ]);

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
