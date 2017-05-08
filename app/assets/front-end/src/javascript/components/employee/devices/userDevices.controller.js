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
    vm.copyUserDevices = [];
    vm.addNewDevice = addNewDevice;

    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.cancel = cancel;
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
        let notToAdd = _.findWhere(vm.copyUserDevices, { id: device.id });
        if(notToAdd === undefined){
          let toRemove = _.findWhere(devicesToRemove, { id: device.id });
          devicesToRemove = _.without(devicesToRemove, toRemove);
          devicesToAdd.push(device);
          vm.copyUserDevices.push(device);
        }
      vm.searchText = "";  
      }
      
    }

    function removeFromQueue(device) {
      let toRemove = _.findWhere(vm.copyUserDevices, { id: device.id });
      vm.copyUserDevices = _.without(vm.copyUserDevices, toRemove);
      devicesToAdd = _.without(devicesToAdd, toRemove);
      devicesToRemove.push(device.id);
    }

    function cancel(){
      vm.copyUserDevices = [];
      User.getUserDevices($stateParams.id)
        .then((data) => {
          vm.userDevices = data;
          vm.copyUserDevices.push(...vm.userDevices);
        });
    }

    function saveDevices() {
      
      if(devicesToAdd.length > 0){
        User.updateDevices(vm.user, devicesToAdd).then((data) => {
          vm.userDevices = data;
        });
        devicesToAdd = [];
      }
       
      if(devicesToRemove.length > 0){
         User.removeDevices(vm.user, devicesToRemove);
         devicesToRemove = [];
      }
      
      vm.showEditDevices = false;
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

    vm.displayEditDevices = () => {
      vm.showEditDevices = !vm.showEditDevices;
    }

  }
  
})(_);
