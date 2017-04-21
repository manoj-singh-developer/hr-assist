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
      templateUrl: rootTemplatePath + 'employee/technologies/employeeSkills.view.html'
    };
  }

}());
