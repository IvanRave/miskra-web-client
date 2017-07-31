(function(angular, APPCONF) {
  'use strict'; 
  
  var xpo = function(lgr){
    
    var setHead = function(ttl, dscr){

      window.document.title = ttl;

      // if no description - set empty or remove it -
      //    to erase state from a previous page
      
      // <meta name="description" content="{{siteDescription}}"/>
      var mta = window.document.querySelector('meta[name=description]');
      if (mta) {
        mta.content = dscr || '';
      }
      
    };

    // var setOpenGraph = function(propName, contentValue){
    //     var mta = window.document.querySelector(`meta[property='og:${propName}']`);

    //     if (mta){
    //       mta.content = contentValue;
    //     } else {
    //     // replace or insert
    //       var elem = document.createElement('meta');
    //       elem.setAttribute('property', 'og:' + propName);
    //       elem.content = contentValue;
    //       window.document.getElementsByTagName('head')[0].appendChild(elem);
    //     }
    // };

    var setCanonicalLink = function(lnk){
      var mta = window.document.querySelector('link[rel=canonical]');

      if (mta) {
        mta.href = lnk;
      } else {    
        var link = document.createElement('link');
        link.rel = 'canonical';
        link.href = lnk;
        window.document.getElementsByTagName('head')[0].appendChild(link);
      }
    };

    var removeCanonicalLink = function(){
      var mta = window.document.querySelector('link[rel=canonical]');
      if (mta){
        mta.parentNode.removeChild(mta);
      }
    };

    var cyr = /[а-яё]/ig;

    // pth = /some-url/cyrillic/asdf?name=supernameencoded
    var encodePath = function(pth){
      var arr = pth.split('/');
      arr = arr.map(function(item){
        if (cyr.test(item)){
          item = encodeURIComponent(item);
        }

        return item;
      });
      return arr.join('/');
    };

    var finishRender = function(statusCode) {
      // fired after $digest:
      //   when all watches will be calculated
      //   and DOM builded
      window.setTimeout(function() {
        // fire after DOM rendering
        if (typeof window.callPhantom === 'function') {
          window.callPhantom({
            appResult: 'clientFinished',
            statusCode: statusCode
          });
          
          lgr.debug('callPhantomFromClient');
        }
        
        lgr.info('runHtmlReady', 'finish render', {
          statusCode: statusCode
        });
        
      }, 0);
    };
    
    var handleOk = function(pageTitle, pageDescription, canonicalPath) {
      // default values the same as in index files gulpfile.js: process-html
      if (!pageTitle || !pageDescription){
        lgr.crit('noTtlAndDscr', 'no ttl and dscr', arguments);
      }

      if (canonicalPath){
        // encode a path: cyrillic to latin
        canonicalPath = encodePath(canonicalPath);
        setCanonicalLink(APPCONF.MAIN_HOST + canonicalPath);
      } else {
        removeCanonicalLink();
      }
      
      setHead(pageTitle + ' - МисКра',
              pageDescription + ' - МисКра');

      // setOpenGraph('title', pageTitle);
      // setOpenGraph('type', 'website');
      // setOpenGraph('url', '');
      
      // setOpenGraph('description', pageDescription);
      // setOpenGraph('locale', 'ru_RU');
      // setOpenGraph('site_name', 'МисКра');
      

      finishRender(200);
    };

    var handleNotFound = function(){
      setHead('404', '');
      removeCanonicalLink();
      finishRender(404);
    };

    var handleServerError = function(err){
      err = err || {};
      setHead('500', '');
      removeCanonicalLink();
      finishRender(500);
      
      lgr.crit('serverError', 'http 500', {
        message: JSON.stringify(err.message), // obj or string
        err: JSON.stringify(err) // if err - is a string
      }, err.stack);
    };

    // https://ru.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D0%BA%D0%BE%D0%B4%D0%BE%D0%B2_%D1%81%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D1%8F_HTTP
    return {
      // 2xx
      ok: handleOk,
      // 3xx
      // moved
      // 404
      notFound: handleNotFound,
      // 401
      //unauthorized: 
      // 5xx
      serverError: handleServerError
    };
  };

  // change title and description
  // - use loaded data, like:
  //   - 100 records found
  //   - masterName of a work, loaded by an async request  
  angular.module('myApp.readiness', [])
    .factory('readiness', [
      'lgr',
      xpo
    ]);
  
})(window.angular, window.APPCONF);

// if (window.callPhantom){
//   window.callPhantom({"appResult": "tmpFinished"});
// }

// Executes the expression on the current scope at a later point in time.
// https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$evalAsync
// $rootScope.$evalAsync(function(){
//   handleOk('', '');
// });
