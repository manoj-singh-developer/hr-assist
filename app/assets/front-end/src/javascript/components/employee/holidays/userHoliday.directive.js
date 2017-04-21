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
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      controller: 'userHolidayCtrl',
      controllerAs: 'userHoliday',
      templateUrl: rootTemplatePath + 'employee/holidays/userHoliday.view.html'
    };
  }

}());
