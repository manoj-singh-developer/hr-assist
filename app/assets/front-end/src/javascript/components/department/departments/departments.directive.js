(function(_) {

  'use strict';

  angular
    .module('HRA')
    .directive('hraDepartments', hraDepartments);

  function hraDepartments() {
    let directive = {
      restrict: 'E',
      scope: {},
      controller: 'departmentsCtrl',
      controllerAs: 'departments',
      templateUrl: rootTemplatePath + '/department/departments/departments.view.html'
    };

    return directive;
  }

})();
