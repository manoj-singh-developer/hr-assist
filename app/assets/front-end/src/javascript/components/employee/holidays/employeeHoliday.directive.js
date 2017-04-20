(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @hraEmployeeHoliday
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .directive('hraEmployeeHoliday', hraEmployeeHoliday);

  function hraEmployeeHoliday() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'employeeHolidayController',
      controllerAs: 'employeeHoliday',
      templateUrl: rootTemplatePath + 'employee/holidays/employeeHoliday.view.html'
    };
  }

}());
