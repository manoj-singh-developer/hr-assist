((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('userDevicesCtrl', userDevicesCtrl);

  function userDevicesCtrl($mdDialog, $rootScope, autocompleteService, Device, User) {

    let vm = this;
    //let componentsToRemove = [];
    let componentsToAdd = [];
    let deviceToEdit = null;

    vm.user = {};
    vm.userDevices = [];
    vm.userComponents = [];
    vm.disableSaveBtn = true;
    vm.editedDevice = false;
    vm.minLength = 0;
    vm.showForm = false;
    vm.components = [];

    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.cancel = cancel;
    vm.save = save;
    vm.toggleForm = toggleForm;
    vm.editDevice = editDevice;
    vm.addComponents = addComponents;
    vm.deleteDevice = deleteDevice;

    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.user = data.user;
      _getUserDevices();
      _getComponents();
    });

    function addComponents() {
      vm.componentAutocomplete = true;
    }

    function editDevice(device) {
      vm.deviceName = device.device_name;
      vm.userComponents = device.components;
      vm.editedDevice = true;
      deviceToEdit = device;
      toggleForm();
    }

    function addInQueue(component) {
      if (component) {
        //let notToAdd = _.findWhere(vm.userTechnologies, { name: component.name });
        //let toRemove = _.findWhere(componentsToRemove, { name: component.name });
        // componentsToRemove = _.without(componentsToRemove, toRemove);
        // componentsToAdd.push(component.id);
        vm.userComponents.push(component);
        _disableSaveBtn(false);
        vm.searchComponent = '';
        vm.minLength = 1;
      }
    }

    function removeFromQueue(component) {
      let toRemove = _.findWhere(vm.userComponents, { name: component.name });
      vm.userComponents = _.without(vm.userComponents, toRemove);
      //componentsToAdd = _.without(componentsToAdd, toRemove);
      // componentsToRemove.push(component.id);
      _disableSaveBtn(false);
    }

    function cancel() {
      _disableSaveBtn(true);
      toggleForm();

      vm.editedDevice = false;
      vm.componentAutocomplete = false;
      deviceToEdit = null;
      vm.minLength = 0;
      vm.searchComponent = '';
      vm.deviceName = '';
      vm.serialNumber = '';
      vm.userComponents = [];
      componentsToAdd = [];
    }

    function save() {
      if (vm.userComponents.length) {
        vm.userComponents.forEach((element, index) => {
          componentsToAdd.push(element.name);
        });
      }

      let objToSave = {
        device_name: vm.deviceName,
        components: componentsToAdd
      }

      if (deviceToEdit) {
        User.removeDevices(vm.user, deviceToEdit).then(() => {
          vm.userDevices = _.without(vm.userDevices, deviceToEdit);

          User.updateDevices(vm.user, objToSave).then((data) => {
            vm.userDevices = data;
          });
        });
      }

      if (!deviceToEdit) {
        User.updateDevices(vm.user, objToSave).then((data) => {
          vm.userDevices = data;
        });
      }

      cancel();
    }

    function deleteDevice(device, event) {
      let confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + device.device_name + ' device?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        User.removeDevices(vm.user, device).then(() => {
          vm.userDevices = _.without(vm.userDevices, device);
        });
      });
    }

    function toggleForm() {
      vm.showForm = !vm.showForm;
    }

    function _getUserDevices() {
      User.getUserDevices(vm.user.id)
        .then((data) => {
          vm.userDevices = data;
        });
    }

    function _getComponents() {
      Device.getComponents()
        .then((data) => {
          vm.components = data;
          autocompleteService.buildList(vm.components, ['name']);
        });
    }

    function _disableSaveBtn(booleanValue) {
      vm.disableSaveBtn = !booleanValue ? booleanValue : true;
    }

  }

})(_);
