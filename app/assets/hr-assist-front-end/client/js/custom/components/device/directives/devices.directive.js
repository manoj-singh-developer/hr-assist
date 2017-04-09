(function() {

  'use strict';

  angular
    .module('HRA')
    .directive('hraDevices', hraDevices);

  function hraDevices() {
    let directive = {
      restrict: 'E',
      scope: {},
      controller: 'devicesCtrl',
      controllerAs: 'devices',
      templateUrl: rootTemplatePath + '/components/device/views/devices.view.html'
    };

    return directive;
  }

})();
