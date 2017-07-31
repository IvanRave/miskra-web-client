(function(angular){
  'use strict';

  class Xpo{
    constructor($scope,
                $state,
                lgr,
                readiness,
                apimas,
                statePrev,
                sessRepo) {

      $scope.page_ttl = 'Вход';

      // TODO: is_stay flag: temporary short-live keys
      $scope.auth = {
        lgn: '', //'115670',
        pwd: '' //'123321'
      };

      $scope.statePrev = statePrev;

      var handle422 = function(edata){
        if (edata.errkey === "validationError") {
          var dtls = edata.details || {};
          if (dtls.property === "pwd" &&
              dtls.msg === "is not correct") {
            return "неверный пароль";
          } else if (dtls.property === "lgn"){
            return "неверный логин";
          }

          return JSON.stringify(edata.details);
        }

        return JSON.stringify(edata);
      };

      var cbkFailAuth = function(e){
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

      var cbkSuccessUpdate = function(){
        var sessData = sessRepo.getData();

        if (sessData.is_editor){
          $state.go('byt.welcome');
        } else {
          // if is_supplier
          // uid must be not null (after log-in)
          $state.go('byt.splrItem.main', {
            supplier_id: sessData.uid
          });
        }
      };

      var cbkSuccessAuth = function(r){
        sessRepo.updateSess(r.auth_token)
          .then(cbkSuccessUpdate)
          .catch(cbkFailAuth);

        // send a token to authFactory
        // add to a session storage (do not do it it this ctrl)
        // redirect masters to MasterPage: using id from auth_token
        // show an Edit button for authed masters (on a MasterPage)

        // use this token in apimas (for secured (POST) requests)
        // any POST request - assumes changing data
        // except Login, where auth=lgn+pwd
        // any GET request - may require auth too
      };


      var cbkFinally = function(){
        $scope.in_progress = false;
      };

      /**
       * Send auth data to the server to receive auth_token
       */
      $scope.sendAuth = function(lgn, pwd){
        $scope.err_msg = '';
        $scope.in_progress = true;
        // check lgn and pwd, in html template
        apimas.sendLogin({
          lgn: lgn,
          pwd: pwd
        })
          .then(cbkSuccessAuth)
          .catch(cbkFailAuth)
          .finally(cbkFinally);
      };

      readiness.ok('Вход: логин и пароль',
                   'Вход или регистрация с последующим входом для мастеров и салонов красоты: форма входа по логину и паролю',
                   $state.href("byt.splrLogin"));
    }
  }

  angular.module('myApp.SplrLoginController', [
    'myApp.apimas',
    'myApp.sessRepo',
    'myApp.readiness',
    'myApp.statePrev'
  ])

    .controller('SplrLoginController', [
      '$scope',
      '$state',
      'lgr',
      'readiness',
      'apimas',
      'statePrev',
      'sessRepo',
      Xpo
    ]);

})(window.angular);
