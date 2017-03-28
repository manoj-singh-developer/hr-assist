(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @hraEmployeeForm
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraSchedule', hraSchedule);

  function hraSchedule() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'hraScheduleCtrl',
      controllerAs: 'hraSchedule',
      templateUrl: rootTemplatePath + '/components/employee/views/employeeSchedule.view.html',
    };
  }

})();
