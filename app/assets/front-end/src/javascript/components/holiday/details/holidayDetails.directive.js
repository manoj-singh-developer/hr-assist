(function() {

  'use strict';

  angular
    .module('HRA')
    .directive('hraHolidayDetails', hraHolidayDetails);

  function hraHolidayDetails() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'holidayDetailsController',
      controllerAs: 'holidayDetails',
      templateUrl: rootTemplatePath + 'holiday/details/holidayDetails.view.html'
    };
  }


}());
