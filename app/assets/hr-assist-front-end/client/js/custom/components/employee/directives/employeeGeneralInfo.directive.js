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
      templateUrl: rootTemplatePath + '/components/employee/views/employeeGeneralInfo.view.html',
    };
  }

})();
