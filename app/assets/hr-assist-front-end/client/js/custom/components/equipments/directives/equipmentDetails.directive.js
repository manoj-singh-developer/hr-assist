(function() {

  'use strict';



  // equipmetsDetailsDirectives directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraEquipmentDetails', hraEquipmentDetails);

  function hraEquipmentDetails() {
    return {
      restrict: 'EA',
      controller: 'equipmentDetailsController',
      templateUrl: rootTemplatePath + 'components/equipments/views/equipmentDetails.view.html'
    }
  }
}());
