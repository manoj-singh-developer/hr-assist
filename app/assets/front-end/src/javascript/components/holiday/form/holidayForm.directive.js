(function() {

  'use strict';

  // hraHolidayForm directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraHolidayForm', hraHolidayForm);

  function hraHolidayForm() {
    return {
      restrict: 'EA',
      scope: {},
      bindToController: {
        holiday: '=',
        holidayIndex: '=',
        formTitle: '='
      },
      controller: 'holidayFormController',
      controllerAs: 'holidayForm',
      templateUrl: rootTemplatePath + '/holiday/form/holidayForm.view.html',
    };
  }

}());
