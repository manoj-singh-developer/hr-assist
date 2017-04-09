(function() {

  'use strict';

  angular
    .module('HRA')
    .directive('hraEmployeesProject', hraEmployeesProject);

  function hraEmployeesProject() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'projectEmployeesCtrl',
      controllerAs: 'prjEmployess',
      templateUrl: rootTemplatePath + 'project/views/projectEmployees.view.html',
    };
  }


  angular
    .module('HRA')
    .controller('projectEmployeesController', projectEmployeesController);

  projectEmployeesController.$inject = ['$rootScope', '$scope', 'autocompleteService', 'miscellaneousService', 'Employee'];

  function projectEmployeesController($rootScope, $scope, autocompleteService, miscellaneousService, Employee) {


  }

}());
