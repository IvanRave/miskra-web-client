(function(angular){
  'use strict';

  var ytbRegexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
  
  class Xpo{
	constructor($scope, apimas){

	  var catchInsertYtb = function(err){
		if (err.status === 422) {
		  var dta = err.data;
		  if (dta){
			if (dta.errkey === "duplicateKeyError"){
			  if (dta.details && dta.details.property === "uq_serv_work__main_video"){
				alert("Данное видео уже было добавлено ранее вами или другим мастером: попробуйте указать другое видео.");
				return;
			  }
			}

			if (dta.errkey === "validationError") {
			  if (dta.details && dta.details.property === "main_video"){
				alert("Неверный формат ссылки на видео: попробуйте указать другое видео.");
				return;
			  }
			}
		  }
		}
		
		console.log(err);
		alert('Возникла непредвиденная ошибка при добавлении: попробуйте позже или укажите другое видео');
	  };
	  
	  $scope.addVideoLink = function(){
		var lnk = window.prompt("Ссылка на Youtube видео, где представлена ваша услуга " + $scope.servRubricName, "https://www.youtube.com/watch?v=");

		// cancel (null) or empty
		if (!lnk){
		  return;
		}

		var result = lnk.match(ytbRegexp);
		console.log(result);

		if (!result || !result[1]){
		  alert('На данный момент поддерживаются только видео из Youtube: укажите корректную ссылку к видео');
		  return;
		}
		
		var yid = result[1];

		console.log(yid);
				
	  	apimas.sendPost("/work/insert-item-with-ytb", {
	  	  master_profile_id: $scope.masterProfileId,
	  	  serv_rubric_id: $scope.servRubricId,
		  main_video: yid
	  	})
	  	  .then((createdWork) => {
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
	  	  })
		  .catch(catchInsertYtb);
	  };

	  // upload on file select or drop
	  var uploadFile = function (tmpFiles) {
		var ind = tmpFiles.length - 1;
		
		var file = tmpFiles[ind];
		if (!file){
		  $scope.progress = null;
		  return;
		}
		// start from 5 percents
		$scope.progress = 5;		
		
		// console.log('uploading...', file);
		apimas.sendMultipart('/work/insert-item-with-file?master_profile_id='+ $scope.masterProfileId + '&serv_rubric_id=' + $scope.servRubricId, file).then(function (resp) {
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

	  $scope.removePreFile = function(tmpFiles, ind){
		tmpFiles.splice(ind,1);
	  };
	  
	  $scope.submit = function(tmpForm, tmpFiles) {
		console.log('submitting...', tmpForm, tmpFiles);
		if (!tmpForm.$valid){
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
	}
  }
					   
  
  var drct = function(){
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
	  controller: [
		'$scope',
		'apimas',
		// '$q',
		// '$state',
		Xpo
	  ]
	};
  };

  angular.module('myApp.workCreatorEdt', [
	'myApp.apimas',
	// for directives
	'ngFileUpload'
  ])
	.directive('workCreatorEdt', [
	  drct
	]);
  
})(window.angular);
