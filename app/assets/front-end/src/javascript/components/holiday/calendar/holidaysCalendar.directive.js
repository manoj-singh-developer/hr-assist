(function() {

  'use strict';

  angular
    .module('HRA')
    .directive('hraHolidaysCalendar', hraHolidaysCalendar);

  function hraHolidaysCalendar() {
    let directive = {
      restrict: 'E',
      replace: false,
      controller: 'holidaysCalendarController as holidaysCalendar',
      templateUrl: rootTemplatePath + '/holiday/calendar/holidaysCalendar.view.html'
    };

    return directive;
  }

})();
