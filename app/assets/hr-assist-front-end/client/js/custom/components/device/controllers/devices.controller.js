((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('devicesCtrl', devicesCtrl);

  devicesCtrl.$inject = ['$scope', '$rootScope', '$mdToast', '$mdDialog', 'autocompleteService', 'Device'];

  function devicesCtrl($scope, $rootScope, $mdToast, $mdDialog, autocompleteService, Device) {

    var vm = this;
    vm.ids = [];
    vm.selected = [];

    // TODO: add "query" and "table" settings in a service, constant or something that can be reused and then reuse it
    vm.query = {
      order: 'name',
      limit: 5,
      page: 1
    };
    vm.table = {
      options: {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: true,
        limitSelect: true,
        pageSelect: true
      },
      query: {
        order: 'name',
        filter: '',
        limit: 10,
        page: 1
      },
      "limitOptions": [10, 15, 20],
      selected: []
    };


    getDevices();


    vm.showAddForm = showAddForm;
    vm.remove = remove;
    vm.editRow = editRow;
    vm.querySearch = querySearch;
    vm.multipleDelete = multipleDelete;
    // vm.getPagination = getPagination;
    vm.addFromJson = addFromJson;

    $rootScope.$on('event:deviceUpdate', function() {
      // TODO: need a beeter approach here,
      // there is no need for an extra request on update
      getDevices();
    });

    $rootScope.$on('event:deviceAdd', function(event, data) {
      vm.devices = vm.devices.concat(data);
    });


    function getDevices() {
      Device.getAll()
        .then(function(data) {
          vm.devices = data;
          return autocompleteService.buildList(vm.devices, ['name']);
        });
    }

    function showAddForm() {
      $mdDialog
        .show({
          templateUrl: rootTemplatePath + '/components/device/views/deviceForm.view.html',
          controller: 'deviceFormCtrl',
          controllerAs: 'deviceForm',
          clickOutsideToClose: true,
          data: {}
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

    function editRow(id) {
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

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.devices);
    }

    function multipleDelete() {
      for (var i = 0; i < vm.table.selected.length; i++) {
        vm.ids.push(vm.table.selected[i].id);
        vm.devices = _.without(vm.devices, _.findWhere(vm.devices, { id: vm.table.selected[i].id }));
      }
      Device.remove({ id: vm.ids })
        .then(function() { vm.table.selected = []; });
    }

    function addFromJson(event) {
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

  }

})(_);
