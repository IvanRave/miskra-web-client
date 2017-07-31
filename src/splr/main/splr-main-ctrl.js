(function(angular, SNNS, APPCONF){
  'use strict';

  var xpo = function($q,
                     $scope,                     
                     $timeout,
                     $state,
                     lgr,
                     readiness,
                     splrLoader,
                     splrInitiator,
                     servTranslator,
                     sessRepo,
                     apimas,
                     statePrev,
                     q_name,
                     q_id,
                     q_tpe,
                     q_hash){


    q_tpe = q_tpe || 'tbl';

    $scope.is_map = q_tpe === 'map';
    

    if ($scope.is_map){
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

    var handleEachServ = function(item, wrapScrollTop){
      if (!item.is_works_once) {
        var elem = document.getElementById('serv' + item.id);
        lgr.debug('elemServ', 'position', {
          offsetTop: elem.offsetTop,
          wrapScrollTop: wrapScrollTop
        });
        if (elem && elem.offsetTop > wrapScrollTop - 51 && elem.offsetTop < wrapScrollTop + 500) {
          item.is_works_once = true;

          var isFresh = $scope.sessData.is_editor || $scope.sessData.uid === $scope.vfirm.id;

          apimas.sendGet('/work/get-by-master-and-rubric',{
            master_profile_id: $scope.vfirm.id,
            serv_rubric_id: item.serv_rubric_id,
            // usually a user watches first 5 images and makes decision
            limit: 5
          }, isFresh).then(r => r.arr_table_work)
            .then(function(arr){
              item.work_scope = {
                arr: arr
              };
            })
            .catch(function(err){
              item.work_scope = {
                err: err
              };
            });
        }
      }
    };

    $scope.$watch('vpos.val', function(wrapScrollTop){ // newVal
      angular.forEach($scope.arr_master_serv, (item) => handleEachServ(item, wrapScrollTop));
    });
    
    $scope.statePrev = statePrev;

    var logout = function(){
      sessRepo.deleteSess();
    };
    
    $scope.logout = logout;

    $scope.isAddToBookmarks = !!(SNNS.addToBookmarks);
    
    $scope.addToBookmarks = function(){
      if (!$scope.isAddToBookmarks){
        return;
      }

      SNNS.addToBookmarks();
    };

    $scope.sessData = sessRepo.getData();

    $scope.calcCitySpecHref = function(tmpMsrv, tmpCityName){
      return $state.href('byt.aggloItem.specItem.rubricItem.tblView', {
        agglo_local_name: tmpCityName,
        spec_name: tmpMsrv.serv_group_name,
        rubric_name: tmpMsrv.serv_rubric_name
      });
    };

    var scopeSupplier = function(vfirm){
      $scope.vfirm = vfirm;
      return vfirm;
    };
    
    /**
     * Load master's services (only for masters from our db)
     */
    var loadServs = function(tmpTpe, tmpFirm){
      if (tmpTpe !== 'tbl') {
        // no need load servs for map
        return $q.when([]);
      }

      // if a moder or owner master
      var isFresh = $scope.sessData.is_editor || $scope.sessData.uid === tmpFirm.id;

      return apimas.sendGet('/master/get-servs-by-master', {
        master_profile_id: tmpFirm.id,
        lang: 'ru'
      }, isFresh).then(function(response){
        return response.arr_master_serv;
      });    
    };

    var scopeServs = function(arrMasterServ){
      // if a error occurs - no names in array of servs
      $scope.arr_master_serv = arrMasterServ;

      $scope.$on('servListRepeatFinished',  function() {
        // scroll by 1px to
        // - receive focus
        // - start to load first gallery
        
        $scope.vpos.val = 1;
      });

      return arrMasterServ;
    };

    var readyAll = function(){
      var dscr = $scope.vfirm.name;

      if ($scope.vfirm.city_name){
        if ($scope.vfirm.city_name_genitive){
          dscr += ' из ' + $scope.vfirm.city_name_genitive;
        } else {
          dscr += ' из города ' + $scope.vfirm.city_name;
        }
      }

      dscr += ' - мастер / салон красоты id' + $scope.vfirm.id;

      //var arrName = $scope.arr_master_serv.map((item) => item.serv_rubric_name);

      angular.forEach($scope.arr_master_serv, function(item, ind){
        if (dscr.length + item.serv_rubric_name.length < 155){
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

      if ($scope.vfirm.city_name){
        ttl += ' - ' + $scope.vfirm.city_name;
      }

      ttl += ` - id${$scope.vfirm.id} - мастер / салон красоты`;
      
      readiness.ok(ttl,
                   dscr,
                   $scope.supplier_url);
    };

    var catchAll = function(response){
      // status – {number} – HTTP status code of the response.
      // -1 executed (for phantomjs) if no connection to the endpoint
      // watch 500 errors on API side
      // response.status === -1
      if (response.status === 404){
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

    $scope.retrieveByMasterAndRubric = function(masterProfileId){
      lgr.debug('rtrv', masterProfileId);
    };

    sessRepo.retrieveSess()
      .then(() => {
        var isFresh = $scope.sessData.is_editor || $scope.sessData.uid === q_id;

        lgr.debug('isFresh', isFresh, {
          q_id: q_id,
          uid: $scope.sessData.uid
        });
        return splrLoader.loadSupplier(q_id, q_tpe, q_hash, isFresh);
      })
      .then(angular.bind(null, splrInitiator.init, q_tpe))
    // return vfirm
      .then(scopeSupplier)
    // load separatelly for a view and for a manager
      .then(angular.bind(null, loadServs, q_tpe))
      .then(servTranslator.translate)
      .then(scopeServs)
    // return entire list of works
    // .then(loadWorks)
    // .then(scopeWorks)
      .then(readyAll)
      .catch(catchAll);
    
    $timeout(function(){      
      $scope.is_prg = true;
    }, 500);
  };
  
  angular.module('myApp.SplrMainController', [
    'myApp.appVkLike',
    'myApp.appCommentForm',
    'myApp.appShareBlock',
    'myApp.splrContactDrct',
    'myApp.splrServDrct',
    'myApp.appScrollWatcher',
    'myApp.appWorkGallery',
    'myApp.apimas',
    'myApp.sessRepo',
    'myApp.readiness',
    'myApp.splrLoader',
    'myApp.splrInitiator',
    'myApp.servTranslator',
    'myApp.statePrev',
    'myApp.appSplrFill'
  ])

    .controller('SplrMainController',[
      '$q',
      '$scope',
      '$timeout',
      '$state',
      'lgr',
      'readiness',
      'splrLoader',
      'splrInitiator',
      'servTranslator',
      'sessRepo',
      'apimas',
      'statePrev',
      'q_name',
      'q_id',
      'q_tpe',
      'q_hash',
      xpo
    ]);
  
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
