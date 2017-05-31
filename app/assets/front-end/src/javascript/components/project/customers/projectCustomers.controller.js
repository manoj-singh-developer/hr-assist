((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectCustomersCtrl', projectCustomersCtrl);

  function projectCustomersCtrl(Project, $rootScope, Customer, autocompleteService) {

    var vm = this;
    let customersToAdd = [];
    let customersToRemove = [];
    vm.project = {};
    vm.customers = [];
    vm.prjCustomers = [];
    vm.copyPrjCustomers = [];
    vm.disableSaveBtn = true;

    _getCustomers();

    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
      _getProjectCustomers();
    });

    vm.addInQueue = (customer) => {
      if (customer) {
        let notToAdd = _.findWhere(vm.copyPrjCustomers, { id: customer.id });
        if (!notToAdd) {
          let toRemove = _.findWhere(customersToRemove, { id: customer.id });
          customersToRemove = _.without(customersToRemove, toRemove);
          customersToAdd.push(customer);
          vm.copyPrjCustomers.push(customer);
        }
        vm.searchText = ' ';
        _disableSaveBtn(false);
      }
    }

    vm.removeFromQueue = (customer) => {
      let toRemove = _.findWhere(vm.copyPrjCustomers, { id: customer.id });
      vm.copyPrjCustomers = _.without(vm.copyPrjCustomers, toRemove);
      customersToAdd = _.without(customersToAdd, toRemove);
      customersToRemove.push(customer);
    }

    vm.save = () => {

      if (customersToAdd.length) {
        Project.saveCustomers(vm.project, customersToAdd)
          .then(() => {
            customersToAdd = [];
          });
      }

      if (customersToRemove.length) {
        Project.removeCustomers(vm.project, customersToRemove)
          .then(() => {
            customersToRemove = [];
          });
      }

      vm.toggleForm();
      _disableSaveBtn(true);
      vm.searchText = '';
    }

    vm.cancel = () => {
      vm.searchText = '';
      vm.copyPrjCustomers = [];
      Project.getCustomers(vm.project).then((data) => {
        vm.prjCustomers = data;
        vm.copyPrjCustomers.push(...vm.prjCustomers);
      });
      _disableSaveBtn(true);
      vm.toggleForm();
    }

    vm.toggleForm = () => {
      vm.showForm = !vm.showForm;
    }

    function _disableSaveBtn(booleanValue) {
      vm.disableSaveBtn = !booleanValue ? booleanValue : true;
    }

    function _getCustomers() {
      Customer.getAll()
        .then((data) => {
          vm.customers = data;
          autocompleteService.buildList(vm.customers, ['name']);
        })
    }

    function _getProjectCustomers() {
      Project.getCustomers(vm.project)
        .then((data) => {
          vm.prjCustomers = data;
          vm.copyPrjCustomers.push(...vm.prjCustomers);
        });
    }

  }

})(_);
