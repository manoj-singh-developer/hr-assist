(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectGeneralCtrl', projectGeneralCtrl);

  function projectGeneralCtrl($rootScope, autocompleteService, dateService, Project) {

    let vm = this;
    vm.project = {};
    vm.validateDate = false;
    vm.displayOrHide = false;
    vm.dateService = dateService;

    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
    });

    vm.save = () => {
      vm.project.start_date = vm.project.start_date ? vm.dateService.format(vm.project.start_date) : null;
      vm.project.end_date = vm.dateService.format(vm.project.end_date);
      Project.update(vm.project);
      vm.displayOrHide = false;
    }

    vm.cancel = () => {
      vm.displayOrHide = !vm.displayOrHide;
      Project.getById(vm.project.id)
        .then((data) => {
          vm.project = data;
        });
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
  }

})();
