(function() {

  'use strict';

  angular
    .module('HRA')
    .directive('hraUserDevices', hraUserDevices);

  function hraUserDevices() {
    let directive = {
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      bindToController: {
        'querySearch': '='
      },
      controller: 'userDevicesCtrl',
      controllerAs: 'userDevices',
      templateUrl: rootTemplatePath + 'employee/devices/userDevices.view.html'
    };
    
    return directive
  }

})();
