((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('usersCtrl', usersCtrl);

  usersCtrl
    .$inject = ['$scope', '$rootScope', '$mdDialog', 'tableSettings', 'autocompleteService', 'User'];

  function usersCtrl($scope, $rootScope, $mdDialog, tableSettings, autocompleteService, User) {

    var vm = this;
    vm.ids = [];
    vm.selected = [];
    vm.users = [];
    vm.tableSettings = tableSettings;
    tableSettings.total = 0;


    _getUsers();


    vm.showForm = showForm;
    vm.showFormJson = showFormJson;
    vm.remove = remove;
    vm.multipleRemove = multipleRemove;
    vm.querySearch = querySearch;


    $rootScope.$on('event:Update', () => {
      // TODO: need a beeter approach here,
      // there is no need for an extra request on update
      _getUsers();
    });

    $rootScope.$on('event:userAdd', (event, data) => {
      vm.users = vm.users.concat(data);
      _updateTablePagination(vm.users);
    });

    function showForm(device) {
      $mdDialog.show({
        templateUrl: rootTemplatePath + '/device/form/deviceForm.view.html',
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
        templateUrl: rootTemplatePath + '/device/formJson/deviceFormJson.view.html',
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
        User.remove(device.id).then((data) => {
          if (data) {
            let toRemove = _.findWhere(vm.users, { id: device.id });
            vm.users = _.without(vm.users, toRemove);
            _updateTablePagination(vm.users);
          }
        });
      });
    }

    function multipleRemove() {}

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.users);
    }


    function _getUsers() {
      User.getAll().then((data) => {
        vm.users = data;
        _updateTablePagination(vm.users);
        return autocompleteService.buildList(vm.users, ['first_name', 'last_name']);
      });
    }

    function _updateTablePagination(data) {
      tableSettings.total = data.length;
    }

  }

})(_);
