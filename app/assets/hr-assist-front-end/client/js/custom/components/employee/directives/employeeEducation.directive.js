(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @hraEmployeeEducation
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .directive('hraEmployeeEducation', hraEmployeeEducation);

  function hraEmployeeEducation() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'employeeEducationController',
      controllerAs: 'employeeEducation',
      templateUrl: rootTemplatePath + '/components/employee/views/employeeEducation.view.html'
    };
  }

}());
