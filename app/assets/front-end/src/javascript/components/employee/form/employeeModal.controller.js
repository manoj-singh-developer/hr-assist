(function() {

  'use strict';

  // ------------------------------------------------------------------------
  //   @empoloyeeModal
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('empoloyeeModal', empoloyeeModal);

  empoloyeeModal
    .$inject = ['$mdDialog', 'data'];





  function empoloyeeModal($mdDialog, data) {

    // ----------------------------------------------------------------------
    //   @VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;

    vm.employees = data.employees;
    vm.employee = angular.copy(data.employee);
    vm.employeeIndex = data.employeeIndex;
    vm.candidate = data.candidate;





    if (data.employeeIndex >= 0) {
      vm.formTitle = 'Edit Form';
    } else {
      vm.formTitle = 'Create Form';
    }

  }

}());
