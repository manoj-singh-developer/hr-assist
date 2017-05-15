(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectFormCtrl', projectFormCtrl);
  projectFormCtrl
    .$inject = ['$scope', 'Project', '$mdToast', '$mdDialog', '$rootScope'];

  function projectFormCtrl($scope, Project, $mdToast, $mdDialog, $rootScope, project) {
    let vm = this;
    vm.project = project || {};
    vm.validateDate = false;

    vm.add = add;
    vm.closeButton = closeButton;
    vm.clearButton = clearButton;
    vm.checkDates = checkDates;

    function add() {
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
    }

    function checkDates() {

      if (vm.project.start_date != undefined && vm.project.end_date != undefined && vm.project.start_date > vm.project.end_date) {
        vm.validateDate = true;
      } else {
        vm.validateDate = false;
      }
    }

  }

})();
