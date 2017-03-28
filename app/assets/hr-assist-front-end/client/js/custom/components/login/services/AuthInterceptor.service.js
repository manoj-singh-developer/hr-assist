(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // set Interceptors
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .factory('AuthInterceptor', AuthInterceptor);

  AuthInterceptor.$inject = ['tokenService'];

  function AuthInterceptor(tokenService) {

    return {
      request: addToken
    };

    function addToken(config) {
      var token = tokenService.getToken('auth_token');

      if (token) {
        config.headers = config.headers || {};
        config.headers.token = token;
      }
      return config;
    }

  }

})();
