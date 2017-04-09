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
      restrict: 'EA',
      scope: {},
      bindToController: {
        candidate: '=',
        progress: '='
      },
      controller: 'emplyeeGeneralInfoCtrl',
      controllerAs: 'employeeGeneralInfo',
      templateUrl: rootTemplatePath + '/employee/views/employeeGeneralInfo.view.html',
    };
  }

})();
