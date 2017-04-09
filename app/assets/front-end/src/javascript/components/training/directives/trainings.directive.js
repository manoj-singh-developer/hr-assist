(function() {

  'use strict';

  // hraTrainings directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraTrainings', hraTrainings);

  function hraTrainings() {
    return {
      restrict: 'EA',
      replace: true,
      bindToController: {
        'candidate': '='
      },
      controller: 'employeesCtrl as employees',
      templateUrl: rootTemplatePath + '/training/views/trainings.view.html'
    };
  }
}());
