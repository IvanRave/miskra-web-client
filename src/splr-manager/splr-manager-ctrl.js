(function(angular){
  'use strict';

  class Xpo{

    constructor($scope,
                readiness,
                apimas,
                sessRepo,
                q_id){

      $scope.sessData = sessRepo.getData();

      $scope.vpos = {
        val: 0
      };

      $scope.$watch('sessData.uid', function(newVal){
        $scope.is_owner = q_id === newVal;
      });

      var cbkResult = function(tmpSupplier){
        if (!tmpSupplier.master_address){
          // empty address object
          tmpSupplier.master_address = {
            master_profile_id: tmpSupplier.id
          };
        }

        $scope.supplier = tmpSupplier;

        readiness.ok('Редактирование мастера / салона красоты',
                     'Редактирование мастера или салона красоты: профиль, адрес, контактные данные, ссылки на другие источники');
      };

      var cbkCatch = function(response){

        if (response.status === 404){
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
      }, true)
        .then(cbkResult)
        .catch(cbkCatch);
    }
  }

  angular.module('myApp.SplrManagerController', [
    'myApp.appScrollWatcher',
    'myApp.splrPhoneEdt',
    'myApp.splrEmailEdt',
    'myApp.splrVkidEdt',
    'myApp.apimas',
    'myApp.sessRepo',
    'myApp.readiness'
  ])
    .controller('SplrManagerController', [
      '$scope',
      'readiness',
      'apimas',
      'sessRepo',
      'q_id',
      Xpo
    ]);

})(window.angular);

