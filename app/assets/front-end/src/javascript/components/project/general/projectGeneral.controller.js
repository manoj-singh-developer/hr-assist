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

    vm.save = save;
    vm.cancel = cancel;
    // vm.checkDates = checkDates;
    vm.toggleForm = toggleForm;

    $rootScope.$on("event:projectLoaded", (event, data) => {
      vm.project = data;
    });

    function save() {
      vm.project.start_date = vm.project.start_date ? vm.dateService.format(vm.project.start_date) : null;
      vm.project.end_date = vm.dateService.format(vm.project.end_date);
      Project.update(vm.project);
      toggleForm();
    }

    function cancel() {
      Project.getById(vm.project.id).then((data) => { vm.project = data; });
      toggleForm();
    }

    // ~~~~~~~ checkDates was removed from view for now,
    // function checkDates() {
    //   let startDate = new Date(vm.project.start_date);
    //   let endDate = new Date(vm.project.end_date);
    //   if (startDate  && endDate && startDate > endDate) {
    //     vm.validateDate = true;
    //   } else {
    //     vm.validateDate = false;
    //   }
    // }

    function toggleForm() {
      vm.showForm = !vm.showForm;
    }

  }

})();
