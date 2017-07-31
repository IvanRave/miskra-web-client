(function(angular){
  'use strict';

  // percent of filling of a profile
  // no services here: separated - required to show in catalogs
  // no min and max limits: validation is separated process
  var profileFilling = {
    bio: {
      arr: ['bio'],
      percent: 20,
      msg: 'описание, биография'
    },
    address: {
      arr: ['address'],
      percent: 20,
      msg: 'адрес, местонахождение'
    },
    any_phone: {
      arr: ['phone',
            'landline',
            'whatsapp',
            'viber'],
      percent: 20,
      msg: 'любой телефон для связи: мобильный, стационарный, viber или whatsapp'
    },
    any_site: {
      arr: ['vkprofile',
            'instagram',
			'website',
			'vkontakte',
			'facebook',
			'odnoklassniki'],
      percent: 20,
      msg: 'ссылка на сайт, личная или публичная страница в социальных сетях'
    },
    any_chat: {
      arr: [
        'skype',
        'twitter',
        'viber',
        'whatsapp',
        'email'],
      percent: 20,
      msg: 'средство связи: скайп, твиттер, viber, whatsap или имэйл'
    }
  };

  var calcFromContacts = function(contacts, address, bio) {
    var obj = {};
    contacts.forEach((c) => {
      obj[c.type] = c.value;
    });

    obj['address'] = address;
    obj['bio'] = bio;
    return obj;
  };

  class Cmp {
    constructor(){
      console.log('hello from app splr fill', this.contacts);

      if (!Array.isArray(this.contacts)){
        return;
      }

      var obj = calcFromContacts(this.contacts, this.address, this.bio);

      var percent = 0;
      var notEnough = [];

      Object.keys(profileFilling).forEach((fillingKey) => {
        var prof = profileFilling[fillingKey];
        var isGroupExists = prof.arr.some((item) => {
          return !!obj[item];
        });

        if (isGroupExists){
          percent += prof.percent;
        } else {
          notEnough.push(prof);
        }
      });

      this.percent = percent;

      this.notEnough = notEnough;
    }
  }

  angular.module('myApp.appSplrFill', [])
    .component('appSplrFill', {
      template: `
<div>
<div class="pdng" ng-if="$ctrl.notEnough.length"
  style="background-color: #e91e63; color: #efefef">
  Профиль заполнен на <b>{{$ctrl.percent}}%</b>
<br>
  Более полное заполнение профиля поднимает мастера во всех каталогах и фотогалереях. Рекомендуем заполнить следующие данные:
<ul>
  <li ng-repeat="ne in $ctrl.notEnough">
    <b>{{ne.percent}}%</b> - {{ne.msg}}
  </li>
</ul>
</div>
</div>
`,
      controller: Cmp,
      bindings: {
        contacts: '<',
        address: '<',
        bio: '<'
      }
    });
})(window.angular);
