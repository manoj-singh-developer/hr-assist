(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @hraEmployeeForm
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .directive('hraUserDevices', hraUserDevices);

  function hraUserDevices() {
    return {
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      bindToController: {
        'toggleForm': '=',
        'querySearch': '=',
        'settings': '='
      },
      controller: 'userDevicesCtrl',
      controllerAs: 'userDevices',
      templateUrl: rootTemplatePath + 'employee/devices/userDevices.view.html'
    };
  }

})();
