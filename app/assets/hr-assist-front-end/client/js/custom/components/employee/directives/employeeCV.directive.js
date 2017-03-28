(function() {

  'use strict';

  // ------------------------------------------------------------------------
  //   @hraEmployeeCv
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .directive('hraEmployeeCv', hraEmployeeCv);

  function hraEmployeeCv() {
    return {
      restrict: 'EA',
      scope: {},
      bindToController: {
        'candidate': '='
      },
      controller: 'hraEmployeeCvController',
      controllerAs: 'employeeCv',
      templateUrl: rootTemplatePath + '/components/employee/views/employee.cv.view.html'
    };
  }

}());
