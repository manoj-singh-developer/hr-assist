(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @hraEmployeeForm
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .directive('hraEmployeeForm', hraEmployeeForm);

  function hraEmployeeForm() {
    return {
      restrict: 'EA',
      scope: {},
      bindToController: {
        employee: '=',
        employeeIndex: '=',
        formTitle: '=',
        candidate: '='
      },
      controller: 'employeeFormController',
      controllerAs: 'employeeForm',
      templateUrl: rootTemplatePath + '/employee/views/employeeForm.view.html',
    };
  }

}());
