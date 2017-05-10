(() => {

  'use strict'

  angular
    .module('HRA')
    .service('errorService', errorService);

  function errorService(tokenService, $state) {

    return {
      forceLogout: forceLogout,
      notUserFound: notUserFound
    }

    function forceLogout (error) {
      if (error) {

        let tokenErr = error.data.error;

        if(tokenErr === '400 Invalid Token') {
          localStorage.removeItem('auth_token'); 
          localStorage.removeItem('user_token'); 

          $state.reload();
        }
      }
    }

    function notUserFound (error) {
      if(error) {
        let errorUsr = error.data.error;
        if(errorUsr === 'not_found') {
          let tokenToDecode = localStorage.getItem('user_token');
          let decodeToken = tokenService.decodeToken(tokenToDecode);
          let userId  = decodeToken.user_id;    
          
          $state.go('employeesParent.details', { id: userId });
        }
      }
    }

  }

})();