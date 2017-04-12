(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @hraEmployeeForm
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .directive('hraGeneralInfo', hraGeneralInfo);

  function hraGeneralInfo() {
    return {
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      bindToController: {
        'toggleForm': '=',
        'querySearch': '=',
        'progress': '=',
        'settings': '='
      },
      controller: 'userGeneralInfoCtrl',
      controllerAs: 'userGeneralInfo',
      templateUrl: rootTemplatePath + '/employee/general/userGeneralInfo.view.html'
    };
  }

})();
