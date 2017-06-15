(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectFormCtrl', projectFormCtrl);

  function projectFormCtrl($scope, Project, $mdToast, $mdDialog, $rootScope, dateService) {
    let vm = this;
    vm.project = {};
    vm.validateDate = false;

    vm.dateService = dateService;
    vm.add = add;
    vm.closeButton = closeButton;
    vm.clearButton = clearButton;
    vm.checkDates = checkDates;
    vm.checkOnGoing = checkOnGoing;

    function add() {
      vm.project.start_date = vm.project.start_date ? vm.dateService.format(vm.project.start_date) : null;
      vm.project.end_date = vm.project.end_date ? vm.dateService.format(vm.project.end_date) : null;
      if (vm.project.id) {
        Project.update(vm.project).then((data) => {
          $rootScope.$emit('event:projectUpdate', data);
          $mdDialog.cancel();
        });
      } else {
        Project.save(vm.project).then((data) => {
          $rootScope.$emit('event:projectAdd', data);
          $mdDialog.cancel();
        });
      }
    }

    function closeButton() {
      $mdDialog.cancel();
    }

    function clearButton() {
      vm.project = {};
      vm.onGoing = undefined;
    }

    function checkOnGoing() {
      vm.project.end_date = vm.onGoing ? null : vm.project.end_date;
      return vm.onGoing;
    }

    function checkDates() {
      if (vm.onGoing) {
        vm.validateDate = false;
      } else {

        if (vm.project.start_date != undefined && vm.project.end_date != undefined && vm.project.start_date > vm.project.end_date) {
          vm.validateDate = true;
        } else {
          vm.validateDate = false;
        }
      }
    }

  }

})();
