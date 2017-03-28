(function() {

  'use strict';

  // hraTrainingDetails directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraTrainingDetails', hraTrainingDetails);

  function hraTrainingDetails() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'trainingDetailsController',
      controllerAs: 'employeeDetails',
      templateUrl: rootTemplatePath + '/components/training/views/trainingDetails.view.html'
    };
  }
}());
