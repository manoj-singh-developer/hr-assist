(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('deviceFormCtrl', deviceFormCtrl);

  deviceFormCtrl
    .$inject = ['$scope', '$rootScope', '$mdDialog', 'data', 'Device'];

  function deviceFormCtrl($scope, $rootScope, $mdDialog, data, Device) {

    // 1. Same form is used for edit and add
    // on edit we get the device from data object passed from devices ctrl
    var vm = this;
    vm.device = data.device || {}; // [1]
    vm.rating = 0;


    vm.add = add;
    vm.clear = clear;
    vm.close = close;


    function add() {
      if (vm.device.id) {
        Device.update(vm.device).then((data) => {
          $rootScope.$emit('event:deviceUpdate', data);
          $mdDialog.cancel();
        });
      } else {
        Device.save(vm.device).then((data) => {
          $rootScope.$emit('event:deviceAdd', data);
          vm.device = {};
          $mdDialog.cancel();
        });
      }
    }

    function clear() {
      vm.device = {};
    }

    function close() {
      $mdDialog.cancel();
    }

  }

})();
