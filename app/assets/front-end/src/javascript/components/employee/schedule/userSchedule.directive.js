(() => {

  'use strict';

  // ------------------------------------------------------------------------
  // @hraEmployeeForm
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraUserSchedule', hraUserSchedule);

  function hraUserSchedule() {
    let directive = {
      restrict: 'A',
      require: 'hraCard',
      scope: {},
      bindToController: {
        'toggleForm': '=',
        'settings': '='
      },
      controller: 'hraScheduleCtrl',
      controllerAs: 'hraSchedule',
      templateUrl: rootTemplatePath + '/employee/schedule/userSchedule.view.html',
    };
    return directive;
  }

})();
