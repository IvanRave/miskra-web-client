(function(angular, lytic){
  'use strict';

  /**
   * Verification code expiration, in seconds
   * @type {Number}
   */
  const EXPIRE_VCODE = 180;

  /**
   * @param {String} ename - Element tag, like 'div', 'a'
   * @param {String} cl - Class name
   * @param {String|[]Object} content - Html or array of child elements
   * @returns A new html element
   */
  var gen = function(ename, cl, content) {
    var obj = document.createElement(ename);
    if (cl){
      obj.className = cl;
    }
    if (content) {
      if (Array.isArray(content) && content.length > 0){
        // children
        content.forEach(function(item){
          obj.appendChild(item);
        });
      } else {
        obj.innerHTML = content;
      }
    }
    return obj;
  };

  var el = {
    div: function(cl, content){ return gen('div', cl, content); },
    form: function(cl, content){ return gen('form', cl, content); },
    button: function(cl, content){ return gen('button', cl, content); },
    label: function(cl, content){ return gen('label', cl, content); },
    // elems without content
    input: function(cl){ return gen('input', cl); }
  };

  var drct = function($state, $interval, lgr, apimas, sessRepo){

    /**
     * @param {Object} apimas - API endpoints for masters
     * @param {Function} next - Callback after PIN will be sended
     */
    var getVcodeForm = function(next){
      var frm = el.form('frm');

      // input PIN
      var lblEmail = el.div(null, 'Укажите имэйл адрес:');
      var inpEmail = el.input();
      inpEmail.autofocus = true;
      inpEmail.type = 'email';
      inpEmail.required = true;

      var wrapEmail = el.div('frm__inp', [inpEmail]);

      frm.appendChild(lblEmail);
      frm.appendChild(wrapEmail);

      // button PIN
      var btnPin = el.button('app-button', 'Получить код для входа');
      btnPin.disabled = true;

      var emailPrev = '';
      var handleBtnPin = function(emailCur){
        //var emailCur = evt.target.value;

        // it allows to ignore non-symbol keys, like Enter, Tab
        // and do not disable/enable if no changes
        if (emailCur === emailPrev) {
          return;
        }

        emailPrev = emailCur;

        if (emailCur){
          btnPin.disabled = false;
        } else {
          btnPin.disabled = true;
        }
      };

      // button depends on input
      inpEmail.addEventListener('change', (evt) => handleBtnPin(evt.target.value));
      inpEmail.addEventListener('keyup', (evt) => handleBtnPin(evt.target.value));

      var wrapBtn = el.div('frm__but', [btnPin]);
      frm.appendChild(wrapBtn);


      /**
       * Send a request to API: verification code
       */
      var sendReq = function(){
        var tmpEmail = inpEmail.value;

        if (!tmpEmail){
          return;
        }

        btnPin.disabled = true;
        // it is just sends a request to the server
        // it is NOT handles a response

        var errVcode = function(status, edata){
          switch (status) {
	      case 422:
            switch (edata.errkey){
            case "validationError":
              var dtls = edata.details || {};
              switch (dtls.property) {
              case "lgn":
                return "Требуется указать корректный имэйл";
              case "lgn_again":
                return "Требуется указать корректный повторный имэйл, совпадающий с основным";
              }
              break;
            case "duplicateKeyError":
              return "На указанный имэйл ранее уже был отправлен проверочный код: для повторной отправки необходимо подождать некоторое время";
            }
            break;
          }

          // send a error to admin
          lgr.crit('errSendVcodeEmail', 'unknown error', {
            status: status,
            edata: edata
          });

          return 'Непредвиденная ошибка: попробуйте повторить позже';
        };

        /**
         * Generate a pin by email
         * - validate email
         * - find a master by email (create if not)
         * - generate a pin, save it
         * - send it by this email
         * - activate/show an input for a pin
         * - activate Login Button when a pin is not null
         */
        apimas.sendVcodeEmail(tmpEmail)
          .then(function(result){
            // return the initial state
            btnPin.disabled = false;
            next(result);

            lytic.trackEvent('vcode-email',
						     'login',
						     {});
          })
          .catch(function(err){
            alert(errVcode(err.status, err.data));
            btnPin.disabled = false;
          });
      };

      // server action depends on
      // - form submit
      // - input value
      frm.addEventListener('submit', function(evt){
        evt.preventDefault();
        sendReq();
      });

      return frm;
    };

    /**
     * Generate a login form
     * @param {Object} apimas - API endpoints for masters
     * @param {String} email
     * @param {Function} callback
     * @param {Object} previous form to return
     * @returns {Object} form wrap
     */
    var getLoginForm = function(email, next, prevForm){
      var frmWrap = el.div();
      var frm = el.form('frm');

      var divEmail = el.div('mrgn', "Укажите проверочный код, который был выслан на имэйл <b>" + email + "</b>");

      //    var lblPin = el.label(null, "Укажите проверочный код:");
      var inpPin = el.input();
      inpPin.type = 'number';
      inpPin.min = 1;
      inpPin.max = 99999;
      inpPin.style.width = "120px";

      inpPin.required = true;
      inpPin.autofocus = true;

      var wrapInpPin = el.div('frm__inp', [
        divEmail,
        inpPin
      ]);

      frm.appendChild(wrapInpPin);

      var btnLogin = el.button('app-button', 'Войти');
      btnLogin.disabled = true;
      var wrapBtnLogin = el.div('frm__inp', [btnLogin]);
      frm.appendChild(wrapBtnLogin);


      var pinPrev = '';
      var handleBtnLogin = function(evt){
        var pinCur = evt.target.value;

        // allows to ignore non-symbol keys
        if (pinCur === pinPrev){
          return;
        }

        pinPrev = pinCur;

        if (pinCur) {
          btnLogin.disabled = false;
        } else {
          btnLogin.disabled = true;
        }
      };

      inpPin.addEventListener('change', handleBtnLogin);
      inpPin.addEventListener('keyup', handleBtnLogin);

      var sendReq = function(){
        var tmpPin = inpPin.value;

        if (!tmpPin){
          return;
        }

        btnLogin.disabled = true;
        // it is just sends a request to the server
        // it is NOT handles a response

        var errLogin = function(status, edata){
          switch (status) {
	      case 422:
            switch (edata.errkey) {
            case 'validationError':
              var dtls = edata.details || {};
              switch (dtls.property){
              case 'lgn':
                return 'Необходимо указать корректный имэйл';
              case 'vcode':
                return 'Необходимо указать корректный проверочный код';
              }

              switch (dtls.code){
              case 'errLgnNotFound':
                return 'Не найдено проверочного кода для указанного имэйла: возможно срок действия кода уже истёк: попробуйте получить код заново';
              case 'errMaxRetry':
                return 'Превышено максимальное количество попыток неверного входа: проверочный код удалён: попробуйте получить код заново';
              case 'errMismatch':
                return 'Указан неверный проверочный код: проверьте корректность кода';
              }

              break;
            }
            break;
	      }

          lgr.crit('errSendLoginEmail', 'unknown error', {
            status: status,
            edata: edata
          });

	      return 'Непредвиденная ошибка: попробуйте повторить позже';
        };

        /**
         * Generate a pin by email
         * - validate email
         * - find a master by email (create if not)
         * - generate a pin, save it
         * - send it by this email
         * - activate/show an input for a pin
         * - activate Login Button when a pin is not null
         */
        apimas.sendLoginEmail(email, tmpPin)
          .then(function(result){
            btnLogin.disabled = false;
            next(result);

            lytic.trackEvent('login-email',
						     'login',
						     {});
          })
          .catch(function(err){
            alert(errLogin(err.status, err.data));
            btnLogin.disabled = false;
          });
      };

      // server action depends on
      // - form submit
      // - input value
      frm.addEventListener('submit', function(evt){
        evt.preventDefault();
        sendReq();
      });

      var lblDscr = el.label(null, "Если не получили код, попробуйте: ");

      var btnOtherEmail = el.button('mrgn', 'указать другой имэйл<br/><small>вернуться</small>');
      var btnOtherCode = el.button('mrgn', '');

      btnOtherEmail.addEventListener('click', function(){
        prevForm();
      });

      var startWait = function(wait){
        btnOtherCode.disabled = true;
        var setWaitText = function(){
          btnOtherCode.innerHTML = 'получить код повторно<br/><small>через ' + wait + ' сек.</small>';
        };

        var inval;

        var cbkInterval = function(){
          if (wait > 0){
            setWaitText();
          } else {
            window.clearInterval(inval);
            btnOtherCode.innerHTML = 'получить другой код<br><small>на имэйл: ' + email + '</small>';
            btnOtherCode.addEventListener('click', function(){
              prevForm();
            });
            btnOtherCode.disabled = false;
          }

          wait -= 1;
        };

        inval = window.setInterval(cbkInterval, 1000);
        // run at current moment
        cbkInterval();
      };

      startWait(EXPIRE_VCODE);

      var wrapDscr = el.div('frm__btn', [
        lblDscr,
        btnOtherEmail,
        btnOtherCode
      ]);

      frmWrap.appendChild(frm);
      frmWrap.appendChild(wrapDscr);

      return frmWrap;
    };


    /**
     * Handle successfull login
     */
    var cbkSuccessUpdate = function(){
	  var sessData = sessRepo.getData();
      lgr.info('sessionUpdate', 'success', sessData);

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

	return {
	  restrict: 'A',
	  link: function(scope, elems){ // attrs

        // ideally: two forms:
        // - for a PIN
        //   - emailInput
        //   - buttonGetPin
        //   - description of a process
        // - for a LOGIN
        //   - emailString
        //   - pinInput
        //   - buttonLogin (disable while no pin)
        //   - retryPinButton (near the pinInput)
        //   - returnToFirstForm (near the emailString)

        // No separate routes for these forms
        //   - route: /login-email?em=123 is a bad practice to show email

        // if a user enters a email the forms will be switched
        // it this is a wrong email
        //   - a user must returns to the first form

        var wrap = elems[0];

        var frmVcode = getVcodeForm(function(result){

          // hide a vcode form
          // show a login form
          var frmLogin = getLoginForm(result.lgn, function(authResult){
            sessRepo.updateSess(authResult.auth_token)
              .then(cbkSuccessUpdate)
              .catch(function(reason){
                // send to admin
                lgr.crit('errUpdateSess', 'login-email', reason);
                alert(reason);
              });

            lgr.info('authResult', 'login-email', authResult);
          }, function(){
            // return to the first form
            wrap.innerHTML = "";
            wrap.appendChild(frmVcode);
          });
          wrap.innerHTML = "";
          wrap.appendChild(frmLogin);
        });

        wrap.appendChild(frmVcode);
      }
	};
  };

  angular.module('myApp.appLoginEmail', [
    'myApp.apimas',
    'myApp.sessRepo'
  ])
	.directive('appLoginEmail', [
      '$state',
      '$interval',
      'lgr',
      'apimas',
      'sessRepo',
	  drct
	]);

})(window.angular, window.LYTIC);
