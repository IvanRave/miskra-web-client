(function(angular) {
  'use strict';
  /*eslint no-console: "off"*/

  var lvl = {
    debug: 'debug',
    info: 'info',
    warn: 'warn',
    crit: 'crit'
  };

  var IS_DEBUG = false;
  try {
    IS_DEBUG = document.location.hostname === 'localhost';
  }
  catch(e) {
    console.log(e);
  }

  var xpo = function(apimas, hprFactory){

    /** 
     * debug: log for non-production
     * info: log for production
     * warn: log, send to email with 'warn'
     * crit: log, send to email with 'crit'
     */
    var send = function(level, id, msg, args, stack) {
      if (!level){
        console.log('no level');
        return;
      }

      if (!IS_DEBUG && level === lvl.debug){
        console.log('skip');
        return;
      }
      
      console.log(level, id, msg);

      if (args) {
        console.log(args);
      }

      if (stack) {
        console.log(stack);
      }

      if (level === lvl.crit || level === lvl.warn){
        // todo: collect some browser info
        var full = {
          level: level,
          id: id,
          msg: msg,
          args: args,
          stack: stack,
          location: window.location.href
        };

        var browserInfo = hprFactory.browserInfo();

        if (!IS_DEBUG){
          apimas.sendLog(JSON.stringify(full) +
                         '\n' +
                         JSON.stringify(browserInfo));
        } else {
          console.log('sendLog', full, browserInfo);
        }
      }

      // id - unique msg id per a project
      // msg - error or log message    
      // args - arguments of current function or any properties
      // stack - error.stack if exists

      // no function name and arguments names:
      //   they changed during minification
      // find a log message by id
    };
    

    // nginx levels: debug, info, notice, warn, error, crit, alert, emerg
    return {
      debug: (id, msg, args, stack) => send(lvl.debug, id, msg, args, stack),
      info: (id, msg, args, stack) => send(lvl.info, id, msg, args, stack),
      warn: (id, msg, args, stack) => send(lvl.warn, id, msg, args, stack),
      crit: (id, msg, args, stack) => send(lvl.crit, id, msg, args, stack)
    };
  };

  angular.module('myApp.lgr', [
    'myApp.apimas',
    'myApp.hprFactory'
  ])
    .factory('lgr', ['apimas', 'hprFactory', xpo]);
  
})(window.angular);
