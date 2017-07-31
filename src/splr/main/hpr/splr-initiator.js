(function(angular){
  'use strict';

  var xpo = function($q,
					 aggloItemRepo,
					 splrAddressHelper){
	var initSupplier = function(q_tpe, tmpSupplier){
	  
	  var cnv = {
		map: function(frm) {
		  var obj =  {
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
		  angular.forEach(frm.contacts, function(ctctGroup){
			angular.forEach(ctctGroup.contacts, function(ctct){
			  //ctct.alias = ctct.text;
			  obj.contacts.push(ctct);
			});
		  });

		  return obj;
		},
		tbl: function(frm){
		  var obj =  {
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
		  if (frm.master_address){
			aggloItemRepo.retrieveById(frm.master_address.geo_district_id).then(function(tmpAggloItem){
			  //console.log('tmpAggloItem', tmpAggloItem);
			  if (tmpAggloItem){
				obj.city_name = tmpAggloItem.local_name;
				obj.city_name_prepositional = tmpAggloItem.case_prepositional;
				obj.city_name_genitive = tmpAggloItem.case_genitive;
			  } else {
				console.log('no city name for ' + frm.master_address);
			  }
			});

			if (frm.master_address.description){		
			  obj.address = splrAddressHelper.calcAddrFromDescription(frm.master_address.description);
              obj.address_comment = splrAddressHelper.calcCommentFromDescription(frm.master_address.description);
			  obj.out_geo = splrAddressHelper.calcOutGeoFromDescription(frm.master_address.description);
			}

			//console.log(obj.city_name);
		  }

		  if (frm.main_phone){
			obj.contacts.push({
			  type: 'phone',
			  value: frm.main_phone,
			  alias: null,
			  comment: ''
			});
		  }

		  if (frm.landline){
			obj.contacts.push({
			  type: 'landline',
			  value: frm.landline,
			  alias: null,
			  comment: ''
			});
		  }

		  if (frm.main_email){
			// email
			obj.contacts.push({
			  type: 'email',
			  value: frm.main_email,
			  alias: null,
			  comment: ''
			});
		  }

		  var socials = [
			'whatsapp',
			'viber',
			'twitter',
			'skype'
		  ];

		  var sites = [
			'website',
			'vkontakte',
			'facebook',
			'odnoklassniki'
		  ];

		  var fixLink = function(tmpLink){
			if (!tmpLink){
			  return tmpLink;
			}

			if (tmpLink.indexOf('http://') !== 0 &&
				tmpLink.indexOf('https://') !== 0){
			  return 'https://' + tmpLink;
			}

			return tmpLink;
		  };
		  
		  angular.forEach(socials, function(social){			
			if (frm[social]){
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

		  angular.forEach(sites, function(site){
			if (frm[site]){
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
		  if (frm.nstg_id){
			obj.contacts.push({
			  type: "instagram",
			  value: "https://www.instagram.com/_u/" + frm.username + '/',
			  alias: "instagram.com/" + frm.username + '/',
			  comment: ''
			});
		  }

		  if (frm.vk_id){
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

	  if (!cnv[q_tpe]){
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
  
  angular.module('myApp.splrInitiator', [
	'myApp.aggloItemRepo',
	'myApp.splrAddressHelper'
  ])

	.factory('splrInitiator', [
	  '$q',
	  'aggloItemRepo',
	  'splrAddressHelper',
	  xpo
	]);
  
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
