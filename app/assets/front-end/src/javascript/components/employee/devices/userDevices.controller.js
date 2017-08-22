((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('userDevicesCtrl', userDevicesCtrl);

  function userDevicesCtrl($rootScope, $stateParams, autocompleteService, Device, User) {

    let vm = this;
    let devicesToAdd = [];
    let devicesToRemove = [];
    
    vm.user = {};
    vm.devices = [];
    vm.userDevices = [];
    vm.copyUserDevices = [];
    vm.disableSaveBtn = true;
    vm.minLength = 0;
    vm.showForm = false;

    vm.addNewDevice = addNewDevice;
    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.cancel = cancel;
    vm.saveDevices = saveDevices;
    vm.toggleForm = toggleForm;

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
        vm.copyUserDevices.push(device);

        vm.searchText = '';
        vm.minLength = 1;
      }
      vm.disableSaveBtn = false;
    }

    function removeFromQueue(device) {
      let toRemove = _.findWhere(vm.copyUserDevices, { id: device.id });
      vm.copyUserDevices = _.without(vm.copyUserDevices, toRemove);
      devicesToAdd = _.without(devicesToAdd, toRemove);
      devicesToRemove.push(device.id);
      vm.disableSaveBtn = false;
    }

    function cancel() {
      vm.copyUserDevices = [];
      User.getUserDevices($stateParams.id)
        .then((data) => {
          vm.userDevices = data;
          vm.copyUserDevices.push(...vm.userDevices);
        });
      vm.searchText = "";
      vm.disableSaveBtn = true;
      vm.minLength = 0;
      toggleForm();
    }

    function saveDevices() {

      if (devicesToRemove.length) {
        User.removeDevices(vm.user, devicesToRemove);
        devicesToRemove = [];
      }

      if (devicesToAdd.length) {
        User.updateDevices(vm.user, devicesToAdd).then((data) => {
          vm.userDevices = data;
        });
        devicesToAdd = [];
      }

      toggleForm();
      vm.disableSaveBtn = true;
      vm.searchText = "";
      vm.minLength = 0;
    }

    function toggleForm() {
      vm.showForm = !vm.showForm;
    }

    function _getDevices() {
      Device.getAll($stateParams.id)
        .then((data) => {
          vm.devices = data;
          autocompleteService.buildList(vm.devices, ['name']);
        });
    }

    function _getUserDevices() {
      User.getUserDevices($stateParams.id)
        .then((data) => {
          vm.userDevices = data;
          vm.copyUserDevices.push(...vm.userDevices);
        });
    }


  }

})(_);
