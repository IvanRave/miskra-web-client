(function(angular){
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

  var xpo = function(){

	var calcWordW = (rbrw, curName, plusWeight) => {
	  angular.forEach(rbrw.item.name.split(' '), (word) => {
		angular.forEach(curName.split(' '), (strWord) => {
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
	var calcLetterW = function(rbrw, curName, plusWeight) {
	  curName = curName.toLowerCase();
	  var itemName = rbrw.item.name.toLowerCase();
	  for (var i = 1; i < itemName.length; i += 1){
		if (curName.indexOf(itemName[i-1]+itemName[i]) >= 0){
		  rbrw.weight += plusWeight;
		}
	  }
	};
	
	// divide by words
	// most words
	// sort by count of masters (show number of masters)
	// arrRubric = arrServRubricStat
	var calcSimilarRubrics = function(arrServRubricStat, curRubric){
	  var arrRubric = arrServRubricStat.filter((item) => {
		// if (item.serv_group_id !== curRubric.serv_group_id) {
		//   return false;
		// }

		if (item.id === curRubric.id){
		  return false;
		}

		// skip one words rubrics: высокочастотные запросы
		if (item.name.split(' ').length < 2){
		  return false;
		}

		// skip rubrics without masters (less than 5)
		// 5 - enough to choose
		if (item.count_master_serv < 5){
		  return false;
		}
		
		return true;
	  });

	  var result = arrRubric.map((itemRubric) => {		
		return {
		  item: itemRubric,
		  weight: 0
		};
	  });

	  // for a word
	  result.forEach((rbrw) => calcWordW(rbrw, curRubric.name, 10));
	  
	  // for a serv group, like hair, nail
	  result.forEach((rbrw) => {
		if (rbrw.item.serv_group_id === curRubric.serv_rubric_id){
		  rbrw.weight += 10;
		}
	  });

	  // from 1 till 500 (/2)
	  // 1 - 50, 50 - 100, 100 - 150, etc.
	  // result.forEach((rbrw) => {
	  // 	rbrw.weight += (rbrw.item.count_master_serv / 2);
	  // });

	  // for a two sequence letters
	  result.forEach((rbrw) => calcLetterW(rbrw, curRubric.name, 1));

	  result.sort((a, b) => {
		return (a.weight > b.weight) ? -1 : 1;
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

  angular.module('myApp.rubricHelper', [])

	.factory('rubricHelper', [xpo]);

}(window.angular));
