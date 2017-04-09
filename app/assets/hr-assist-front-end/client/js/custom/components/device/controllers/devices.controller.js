((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('devicesCtrl', devicesCtrl);

  devicesCtrl
    .$inject = ['$scope', '$rootScope', '$mdToast', '$mdDialog', 'tableSettings', 'autocompleteService', 'Device'];

  function devicesCtrl($scope, $rootScope, $mdToast, $mdDialog, tableSettings, autocompleteService, Device) {

    var vm = this;
    vm.ids = [];
    vm.selected = [];
    vm.tableSettings = tableSettings;


    _getDevices();


    vm.showFormCreate = showFormCreate;
    vm.showFormUpdate = showFormUpdate;
    vm.showFormJson = showFormJson;
    vm.remove = remove;
    vm.multipleRemove = multipleRemove;
    vm.querySearch = querySearch;


    $rootScope.$on('event:deviceUpdate', function() {
      // TODO: need a beeter approach here,
      // there is no need for an extra request on update
      _getDevices();
    });

    $rootScope.$on('event:deviceAdd', function(event, data) {
      vm.devices = vm.devices.concat(data);
    });

    function showFormCreate() {
      $mdDialog
        .show({
          templateUrl: rootTemplatePath + '/components/device/views/deviceForm.view.html',
          controller: 'deviceFormCtrl',
          controllerAs: 'deviceForm',
          clickOutsideToClose: true,
          data: {}
        });
    }

    function showFormUpdate(id) {
      let device = vm.devices.filter(function(item) {
        return item.id === id;
      })[0] || {};

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

    function remove(id, ev, name) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + name + ' equipment?')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(function() {
        Device.remove(id)
          .then(function() {
            vm.devices = _.without(vm.devices, _.findWhere(vm.devices, { id: id }));
          });
      });
    }

    function multipleRemove() {
      for (var i = 0; i < vm.table.selected.length; i++) {
        vm.ids.push(vm.table.selected[i].id);
        vm.devices = _.without(vm.devices, _.findWhere(vm.devices, { id: vm.table.selected[i].id }));
      }
      Device.remove({ id: vm.ids })
        .then(function() { vm.table.selected = []; });
    }

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.devices);
    }


    function _getDevices() {
      Device.getAll()
        .then(function(data) {
          vm.devices = data;
          return autocompleteService.buildList(vm.devices, ['name']);
        });
    }

  }

})(_);
