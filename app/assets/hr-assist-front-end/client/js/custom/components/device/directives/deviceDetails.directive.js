(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraDeviceDetails', hraDeviceDetails);

  function hraDeviceDetails() {
    return {
      restrict: 'EA',
      controller: 'deviceDetailsCtrl',
      controllerAs: 'deviceDetails',
      templateUrl: rootTemplatePath + 'components/device/views/deviceDetails.view.html'
    };
  }

})();
