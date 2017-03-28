(function (  ) {

  'use strict';

  function Callback ($mdToast, $rootScope ) {
    return {
      success: function ( message ) {
        $rootScope.showToast(message || 'Success!')
      },
      error: function ( message ) {
       $rootScope.showToast(message || 'Failed!')
      }
    }
  }

  Callback
  .$inject = ['$mdToast', '$rootScope'];
  angular
    .module('HRA')
    .factory('Callback', Callback);
}());
