(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @hraEmployeeForm
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .directive('hraLanguage', hraLanguage);

  function hraLanguage() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'hraLanguageCtrl',
      controllerAs: 'employeeLanguage',
      templateUrl: rootTemplatePath + '/components/employee/views/employeeLanguage.view.html',
    };
  }

})();
