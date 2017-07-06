(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('candidateFormCtrl', candidateFormCtrl);

  function candidateFormCtrl($scope, Project, $mdToast, $mdDialog, $rootScope, dateService) {
    let vm = this;
    vm.candidate = {};
    vm.validateDate = false;
    vm.onGoing = false;
    vm.status = ['applied', 'meeting', 'test', 'accepted', 'failed', 'internship', 'employee'];
    vm.technologiesToAdd = [{}];
    vm.dateService = dateService;
    vm.add = add;
    vm.closeButton = closeButton;
    vm.clearButton = clearButton;
    vm.checkDates = checkDates;
    vm.checkOnGoing = checkOnGoing;
    vm.addNewTechnology = addNewTechnology;

    function addNewTechnology() {
      vm.technologiesToAdd.push({});
    }

    function add() {
      vm.candidate.start_date = vm.candidate.start_date ? vm.dateService.format(vm.candidate.start_date) : null;
      vm.candidate.end_date = vm.candidate.end_date ? vm.dateService.format(vm.candidate.end_date) : null;

      console.log(vm.candidate);

      // Candidate.save(vm.candidate).then((data) => {
      //   $rootScope.$emit('event:projectAdd', data);
      //   $mdDialog.cancel();
      // });
    }


    function closeButton() {
      $mdDialog.cancel();
    }

    function clearButton() {
      // vm.candidate = {};
      // vm.onGoing = null;
    }

    function checkOnGoing() {
      vm.candidate.end_date = vm.onGoing ? null : vm.candidate.end_date;
      return vm.onGoing;
    }

    function checkDates() {
      if (vm.onGoing) {
        vm.validateDate = false;
      } else {

        if (vm.candidate.start_date && vm.candidate.end_date && vm.candidate.start_date > vm.candidate.end_date) {
          vm.validateDate = true;
        } else {
          vm.validateDate = false;
        }
      }
    }

  }

})();
