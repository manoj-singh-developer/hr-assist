(function() {

  'use strict';

  angular.module('HRA').directive('hraEmployeeTechnologies', hraEmployeeTechnologies);

  function hraEmployeeTechnologies() {
    return {
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      bindToController: {
        'querySearch': '='
      },
      controller: 'employeeTechnologiesController',
      controllerAs: 'employeeTechnologies',
      templateUrl: rootTemplatePath + 'employee/technologies/employeeTechnologies.view.html'
    };
  }

}());
