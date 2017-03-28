/*jshint esversion: 6 */

(function() {

  'use strict';

  // GET/SET token
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .service('tokenService', tokenService);

  tokenService.$inject = ['apiUrl', '$window'];

  function tokenService(apiUrl, $window) {
    var store = $window.localStorage;
    var userToken = 'user_token';
    var authToken = 'auth_token';

    // Public API here
    return {
      setTokens: setTokens,
      getToken: getToken,
      decodeToken: decodeToken
    };


    function setTokens(tokens) {
      // var authToken = store.getItem('auth_token');
      // var userToken = store.getItem('user_token');
      // debugger;

      if (tokens) {
        store.setItem(userToken, tokens[0]);
        store.setItem(authToken, tokens[1]);
      } else {
        store.removeItem(userToken);
        store.removeItem(authToken);
      }
    }


    function getToken(type) {
      return store.getItem(type);
    }


    function decodeToken(token) {
      if (token) {
        var base64Url = '';
        var base64 = '';

        base64Url = token.split('.')[1];
        base64 = base64Url.replace('-', '+').replace('_', '/');

        return JSON.parse($window.atob(base64));
      }
    }


  }

})();
