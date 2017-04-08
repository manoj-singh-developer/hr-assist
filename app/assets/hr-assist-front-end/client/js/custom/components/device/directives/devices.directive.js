(function() {

  'use strict';

  angular
    .module('HRA')
    .directive('hraDevices', hraDevices);

  function hraDevices() {
    return {
      restrict: 'EA',
      controller: 'devicesCtrl',
      controllerAs: 'devices',
      templateUrl: rootTemplatePath + '/components/device/views/devices.view.html'
    };
  }

})();
