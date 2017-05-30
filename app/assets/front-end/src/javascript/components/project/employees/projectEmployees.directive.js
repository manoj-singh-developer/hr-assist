(function() {

  'use strict';

  angular
    .module('HRA')
    .directive('hraProjectEmployees', hraProjectEmployees);

  function hraProjectEmployees() {
    return {
      restrict: 'EA',
      scope: {},
      require: 'hraCard',
      bindToController: {
        'toggleForm': '=',
        'querySearch': '=',
        'settings': '='
      },
      controller: 'projectUsersCtrl',
      controllerAs: 'prjUsers',
      templateUrl: rootTemplatePath + 'project/employees/projectEmployees.view.html',
    };
  }

}());
