(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @hraEmployeeSkills
  // ------------------------------------------------------------------------

  angular.module('HRA').directive('hraEmployeeSkills', hraEmployeeSkills);

  function hraEmployeeSkills() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'employeeSkillsController',
      controllerAs: 'employeeSkills',
      templateUrl: rootTemplatePath + '/components/employee/views/employeeSkills.view.html'
    };
  }

}());
