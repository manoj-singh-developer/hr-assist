((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('userDevicesCtrl', userDevicesCtrl);

  userDevicesCtrl
    .$inject = ['$rootScope', 'autocompleteService', 'User', '$stateParams', 'Device'];

  function userDevicesCtrl($rootScope, autocompleteService, User, $stateParams, Device) {

    let vm = this;
    let devicesToAdd = [];
    let devicesToRemove = [];
    vm.user = {};
    vm.devices = [];
    vm.userDevices = [];
    vm.addNewDevice = addNewDevice;

    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.saveDevices = saveDevices;
    vm.showEditDevices = false;

    _getDevices();

    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.user = data.user;
      _getUserDevices();
    });

    function addNewDevice() {
      if (!vm.devicesToAdd) {
        vm.devicesToAdd = [];
      }
      vm.devicesToAdd.push({});

    }

    function addInQueue(device) {
      if (device) {
        let toRemove = _.findWhere(devicesToRemove, { id: device.id });
        devicesToRemove = _.without(devicesToRemove, toRemove);
        devicesToAdd.push(device);
        vm.userDevices.push(device);
        vm.searchText = "";

        User.updateDevices(vm.user, devicesToAdd);
      }
    }

    function removeFromQueue(device) {
      let toRemove = _.findWhere(vm.userDevices, { id: device.id });
      vm.userDevices = _.without(vm.userDevices, toRemove);
      devicesToAdd = _.without(devicesToAdd, toRemove);
      devicesToRemove.push(device);

      User.removeDevices(vm.user, devicesToRemove);
    }

    function saveDevices() {
      _getUserDevices();
      vm.showEditDevices = false;
    }

    function _getDevices() {
      Device.getAll($stateParams.id)
        .then((data) => {
          vm.devices = data;
          autocompleteService.buildList(vm.devices, ['name']);
        })
    }

    function _getUserDevices() {
      User.getUserDevices($stateParams.id)
        .then((data) => {
          vm.userDevices = data;
        })
    }

    vm.displayEditDevices = () => {
      vm.showEditDevices = !vm.showEditDevices;
    }

  }
  
})(_);
