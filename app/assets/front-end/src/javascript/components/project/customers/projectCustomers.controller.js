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
    vm.displayOrHide = false;

    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.save = save;
    vm.cancel = cancel;

    _getCustomers();

    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
      _getProjectCustomers();
    });

    function addInQueue(customer){      
      if(customer){ 
        let toRemove = _.findWhere(customersToRemove, { id: customer.id });
        customersToRemove = _.without(customersToRemove, toRemove);
        customersToAdd.push(customer);
        vm.prjCustomers.push(customer);
        vm.searchText = "";
      }
    }

    function removeFromQueue(customer){
      let toRemove = _.findWhere(vm.prjCustomers, { id: customer.id });
      vm.prjCustomers = _.without(vm.prjCustomers, toRemove);
      customersToAdd = _.without(customersToAdd, toRemove);
      customersToRemove.push(customer);
      vm.searchText = "";
    }

    function save() {
      
      if (customersToAdd.length) {
        Project.saveCustomers(vm.project, customersToAdd)
          .then(() => {
            _getProjectCustomers();
          });
      }

      if (customersToRemove.length) {
        Project.removeCustomers(vm.project, customersToRemove)
          .then(() => {
            _getProjectCustomers();
          });
      }

      vm.displayOrHide = false;
    }

    function cancel() {
      vm.prjCustomers = [];
      Project.getCustomers(vm.project).then((data) => {
        vm.prjCustomers = data;
      });
    }

    function _getCustomers() {
      Customer.getAll()
        .then((data) => {
          vm.customers = data;
          autocompleteService.buildList(vm.customers, ['name']);
        })
    }

    function _getProjectCustomers(){
      Project.getCustomers(vm.project)
        .then((data) => {
          vm.prjCustomers = data;
        });
    }

    vm.displayForm = () => {
      vm.displayOrHide = !vm.displayOrHide;
    }

  }

})(_);
