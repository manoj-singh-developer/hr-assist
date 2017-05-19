(() => {

  'use strict';

  angular
    .module('HRA')
    .service('errorService', errorService);

  function errorService(tokenService, $state, $timeout) {

    return {
      forceLogout: forceLogout,
      notUserFound: notUserFound
    };

    function forceLogout (error) {
      if (error.data !== null) {
        let tokenErr = error.data.error || '';
        if(tokenErr === '400 Invalid Token' || tokenErr === "400 Token Expired") {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_token');

          $timeout(() => {
            window.location.reload();
          }, 500);
        }
      }
    }

    function notUserFound (error) {
      if(error.data !== null) {
        let errorUsr = error.data.error;
        if(errorUsr === 'not_found') {
          let tokenToDecode = localStorage.getItem('user_token');
          let decodeToken = tokenService.decodeToken(tokenToDecode);
          let userId  = decodeToken.user_id;

          $state.go('employeesParent.details', { id: userId });
          $timeout(() => {
            window.location.reload();
          }, 500);
        }
      }
    }

  }

})();
