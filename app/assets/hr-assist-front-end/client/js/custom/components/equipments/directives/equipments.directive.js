(function() {
  'use strict';



  // viewlistequipments directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraEquipments', hraEquipments);

  function hraEquipments() {
    return {
      restrict: 'EA',
      controller: 'allEquipmentsController',
      templateUrl: rootTemplatePath + '/components/equipments/views/equipments.view.html'
    };
  }
})();
