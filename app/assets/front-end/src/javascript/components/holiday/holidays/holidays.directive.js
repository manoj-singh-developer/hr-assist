(function() {

  'use strict';

  angular
    .module('HRA')
    .directive('hraHolidays', hraHolidays);

  function hraHolidays() {
    let directive = {
      restrict: 'E',
      replace: true,
      controller: 'HolidaysController as holidays',
      templateUrl: rootTemplatePath + '/holiday/holidays/holidays.view.html'
    };

    return directive;
  }

})();
