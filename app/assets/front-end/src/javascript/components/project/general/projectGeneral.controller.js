(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectGeneralCtrl', projectGeneralCtrl);

  function projectGeneralCtrl($rootScope, autocompleteService, dateService, Project) {

    let vm = this;
    vm.project = {};
    vm.validateDate = false;
    vm.dateService = dateService;
    vm.showForm = false;

    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
    });

    vm.save = () => {
      vm.project.start_date = vm.project.start_date ? vm.dateService.format(vm.project.start_date) : null;
      vm.project.end_date = vm.dateService.format(vm.project.end_date);
      Project.update(vm.project);
      vm.toggleForm()
    }

    vm.cancel = () => {
      Project.getById(vm.project.id)
        .then((data) => {
          vm.project = data;
        });
      vm.toggleForm();
    }

    vm.checkDates = () => {
      let startDate = new Date(vm.project.start_date);
      let endDate = new Date(vm.project.end_date);
      if (startDate != undefined && endDate != undefined && startDate > endDate) {
        vm.validateDate = true;
      } else {
        vm.validateDate = false;
      }
    }
    vm.toggleForm = () => {
      vm.showForm = !vm.showForm;
    }

  }

})();
