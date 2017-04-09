(function() {

  'use strict';

  // ------------------------------------------------------------------------
  //   @EempoloyeeJsonModal
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('empoloyeeJsonModal', empoloyeeJsonModal);

  empoloyeeJsonModal
    .$inject = ['$mdDialog', '$rootScope', 'Employee'];





  function empoloyeeJsonModal($mdDialog, $rootScope, Employee) {

    // ----------------------------------------------------------------------
    //   @VARIABLES
    // ----------------------------------------------------------------------


    var vm = this;





    // ----------------------------------------------------------------------
    //   @PUBLIC METHODS
    // ----------------------------------------------------------------------

    vm.saveFromJson = saveFromJson;
    vm.clearFields = clearFields;
    vm.closeDialog = closeDialog;





    // ----------------------------------------------------------------------
    //   @PUBLIC METHODS DECLARATIONS
    // ----------------------------------------------------------------------

    function saveFromJson(json) {
      if (json) {
        json = angular.fromJson(json);

        Employee.savefromJson(json).then(
          function(data) {
            $rootScope.$broadcast('employeesListChanged', ['saveFromJson', data]);
            $rootScope.showToast('Successfully added employees from json!');
          },
          function(error) {});
      } else {
        console.log('Empty json!');
      }
    }

    function clearFields() {
      vm.json = '';
    }

    function closeDialog() {
      $mdDialog.cancel();
    }

  }

}());
