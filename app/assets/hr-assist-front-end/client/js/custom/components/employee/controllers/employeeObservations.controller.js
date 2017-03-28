(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @employeeObservationsController
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('employeeObservationsController', employeeObservationsController);

  employeeObservationsController
    .$inject = ['$rootScope', '$scope'];





  function employeeObservationsController($rootScope, $scope) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    vm.disableObservations = true;





    // ----------------------------------------------------------------------
    // EXPOSED PUBLIC METHODS
    // ----------------------------------------------------------------------

    /* beautify preserve:start */
    vm.saveEmployee   = saveEmployee;
    vm.cancelAdd      = cancelAdd;
    vm.clearFields    = clearFields;
    vm.toggleCard     = toggleCard;
    /* beautify preserve:end */





    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    var getEmployee = $rootScope.$on('employeeIsLoadedEvent', function(event, employee) {
      vm.employee = employee;
    });

    $scope.$on('$destroy', function() {
      getEmployee();
    });




    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function toggleCard(event, action) {

      var card = angular
        .element(event.currentTarget)
        .closest('.js-employee-card');

      $rootScope.$emit("event:toggleCard", card, action);

    }


    function saveEmployee(employee) {

      vm.disableObservations = true;
      $rootScope.$emit("callSaveMethodCards", employee);

    }

    function clearFields() {

      vm.employee = {};

    }

    function cancelAdd() {

      vm.disableObservations = true;

    }


  }

})();
