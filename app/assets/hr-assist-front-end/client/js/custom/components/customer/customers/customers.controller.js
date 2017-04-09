((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('customersCtrl', customersCtrl);

  customersCtrl
    .$inject = ['$scope', '$rootScope', '$mdDialog', 'tableSettings', 'autocompleteService', 'Customer'];

  function customersCtrl($scope, $rootScope, $mdDialog, tableSettings, autocompleteService, Customer) {

    var vm = this;
    vm.ids = [];
    vm.selected = [];
    vm.customers = [];
    vm.tableSettings = tableSettings;


    _getCustomers();


    vm.showForm = showForm;
    vm.showFormJson = showFormJson;
    vm.remove = remove;
    vm.multipleRemove = multipleRemove;
    vm.querySearch = querySearch;


    $rootScope.$on('event:customerUpdate', () => {
      // TODO: need a beeter approach here,
      // there is no need for an extra request on update
      _getCustomers();
    });

    $rootScope.$on('event:customerAdd', (event, data) => {
      vm.customers = vm.customers.concat(data);
    });

    function showForm(customer) {
      $mdDialog.show({
        templateUrl: rootTemplatePath + '/components/customer/form/customerForm.view.html',
        controller: 'customerFormCtrl',
        controllerAs: 'customerForm',
        clickOutsideToClose: true,
        data: {
          customer: angular.copy(customer),
        }
      });
    }

    function showFormJson(event) {
      event.stopPropagation();

      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: rootTemplatePath + '/components/customer/views/customerFormJson.view.html',
        controller: 'customerFormJsonCtrl',
        controllerAs: 'customerFormJson',
        targetEvent: event,
        clickOutsideToClose: true,
      });
    }

    function remove(customer, event) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + customer.name + ' customer ?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        Customer.remove(customer.id).then((data) => {
          if (data) {
            let toRemove = _.findWhere(vm.customers, { id: customer.id });
            vm.customers = _.without(vm.customers, toRemove);
          }
        });
      });
    }

    function multipleRemove() {}

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.customers);
    }

    function _getCustomers() {
      Customer.getAll().then((data) => {
        vm.customers = data;
        return autocompleteService.buildList(vm.customers, ['name']);
      });
    }

  }

})(_);
