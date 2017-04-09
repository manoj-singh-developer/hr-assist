((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('devicesCtrl', devicesCtrl);

  devicesCtrl
    .$inject = ['$scope', '$rootScope', '$mdDialog', 'tableSettings', 'autocompleteService', 'Device'];

  function devicesCtrl($scope, $rootScope, $mdDialog, tableSettings, autocompleteService, Device) {

    var vm = this;
    vm.ids = [];
    vm.selected = [];
    vm.tableSettings = tableSettings;


    _getDevices();


    vm.showForm = showForm;
    vm.showFormJson = showFormJson;
    vm.remove = remove;
    vm.multipleRemove = multipleRemove;
    vm.querySearch = querySearch;


    $rootScope.$on('event:deviceUpdate', () => {
      // TODO: need a beeter approach here,
      // there is no need for an extra request on update
      _getDevices();
    });

    $rootScope.$on('event:deviceAdd', (event, data) => {
      vm.devices = vm.devices.concat(data);
    });

    function showForm(device) {
      $mdDialog.show({
        templateUrl: rootTemplatePath + '/components/device/views/deviceForm.view.html',
        controller: 'deviceFormCtrl',
        controllerAs: 'deviceForm',
        clickOutsideToClose: true,
        data: {
          device: angular.copy(device),
        }
      });
    }

    function showFormJson(event) {
      event.stopPropagation();

      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: rootTemplatePath + '/components/device/views/deviceFormJson.view.html',
        controller: 'deviceFormJsonCtrl',
        controllerAs: 'deviceFormJson',
        targetEvent: event,
        clickOutsideToClose: true,
      });
    }

    function remove(device, event) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + device.name + ' equipment?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        Device.remove(device.id).then((data) => {
          if (data) {
            let toRemove = _.findWhere(vm.devices, { id: device.id });
            vm.devices = _.without(vm.devices, toRemove);
          }
        });
      });
    }

    function multipleRemove() {
      for (var i = 0; i < vm.table.selected.length; i++) {
        vm.ids.push(vm.table.selected[i].id);
        vm.devices = _.without(vm.devices, _.findWhere(vm.devices, { id: vm.table.selected[i].id }));
      }
      Device.remove({ id: vm.ids }).then(() => { vm.table.selected = []; });
    }

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.devices);
    }


    function _getDevices() {
      Device.getAll().then((data) => {
        vm.devices = data;
        return autocompleteService.buildList(vm.devices, ['name']);
      });
    }

  }

})(_);
