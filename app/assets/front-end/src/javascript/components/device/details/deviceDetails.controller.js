(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('deviceDetailsCtrl', deviceDetailsCtrl);

  deviceDetailsCtrl.$inject = ['$scope', '$stateParams', '$mdToast', 'Device'];

  function deviceDetailsCtrl($scope, $stateParams, $mdToast, Device) {

    var vm = this;
    var deviceId = parseInt($stateParams.id, 10);


    _getDevice();
    _getDeviceEmployees();


    function _getDevice() {
      Device.getById(deviceId).then(data => vm.device = data);
    }

    function _getDeviceEmployees() {
      Device.getEmployees(deviceId).then(data => vm.employees = data);
    }

  }

})();
