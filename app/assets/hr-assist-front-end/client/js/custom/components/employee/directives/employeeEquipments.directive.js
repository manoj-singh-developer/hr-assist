(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @hraEmployeeForm
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .directive('hraEmployeeEquipments', hraEmployeeEquipments);

  function hraEmployeeEquipments() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'hraEquipmentsCtrl',
      controllerAs: 'employeeEquipments',
      templateUrl: rootTemplatePath + '/components/employee/views/employeeEquipments.view.html',
    };
  }

})();
