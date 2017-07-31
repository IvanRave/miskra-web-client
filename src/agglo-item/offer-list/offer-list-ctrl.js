(function(angular){
  'use strict';

  //var parentEl = angular.element(document.body);

  var xpo = function(){
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
  
  angular.module('myApp.OfferListController', [])

	.controller('OfferListController', [
	  xpo
	]);
})(window.angular);
