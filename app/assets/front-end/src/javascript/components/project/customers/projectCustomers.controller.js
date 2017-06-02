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

    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.save = save;
    vm.cancel = cancel;
    vm.toggleForm = toggleForm;

    _getCustomers();

    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
      _getProjectCustomers();
    });

    function addInQueue(customer) {
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

    function removeFromQueue(customer) {
      let toRemove = _.findWhere(vm.copyPrjCustomers, { id: customer.id });
      vm.copyPrjCustomers = _.without(vm.copyPrjCustomers, toRemove);
      customersToAdd = _.without(customersToAdd, toRemove);
      customersToRemove.push(customer);
      _disableSaveBtn(false);
    }

    function save() {

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

      toggleForm();
      _disableSaveBtn(true);
      vm.searchText = '';
    }

    function cancel() {
      vm.searchText = '';
      vm.copyPrjCustomers = [];
      _getProjectCustomers();
      _disableSaveBtn(true);
      toggleForm();
    }

    function toggleForm() {
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
