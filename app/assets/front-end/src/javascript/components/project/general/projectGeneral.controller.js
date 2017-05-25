(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectGeneralCtrl', projectGeneralCtrl);

  function projectGeneralCtrl($rootScope, autocompleteService, dateService, Project) {

    let vm = this;
    let projectCoppy = {};

    vm.project = {};
    vm.validateDate = false;
    vm.displayOrHide = false;
    vm.dateService = dateService;

    vm.save = save;
    vm.cancel = cancel;
    vm.checkDates = checkDates;

    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
      projectCoppy = angular.copy(data);
    });

    function save() {
      vm.project.start_date = vm.project.start_date ? vm.dateService.format(vm.project.start_date) : null;
      vm.project.end_date = vm.dateService.format(vm.project.end_date);
      Project.update(vm.project);
      vm.displayOrHide = false;
    }

    function cancel() {
      vm.displayOrHide = !vm.displayOrHide;
      vm.project = angular.copy(projectCoppy);
    }

    function checkDates() {
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
