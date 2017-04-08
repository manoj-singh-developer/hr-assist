(() => {

  'use strict';

  deviceDetailsCtrl.$inject = ['$scope', '$stateParams', '$mdToast', 'Device'];

  angular
    .module('HRA')
    .controller('deviceDetailsCtrl', deviceDetailsCtrl);

  function deviceDetailsCtrl($scope, $stateParams, $mdToast, Device) {

    var vm = this;
    var deviceId = parseInt($stateParams.id, 10);


    getDevice();
    getDeviceEmployees();


    function getDevice() {
      Device.getById(deviceId)
        .then(function(data) { vm.device = data; });
    }

    function getDeviceEmployees() {
      Device.getEmployees(deviceId)
        .then(function(data) { vm.employees = data; });
    }

  }

})();
