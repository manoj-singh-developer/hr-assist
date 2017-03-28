(function() {

  'use strict';

  //hraEmployeesProject directives
  //----------------------------------------------------------------

  angular
    .module('HRA')
    .directive('hraEmployeesProject', hraEmployeesProject);

  function hraEmployeesProject() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'projectEmployeesController',
      controllerAs: 'projectEmployess',
      templateUrl: rootTemplatePath + 'components/project/views/projectEmployees.view.html',
    };
  }


  //projectEmployees Controller
  //-----------------------------------------------------------

  angular
    .module('HRA')
    .controller('projectEmployeesController', projectEmployeesController);

  projectEmployeesController.$inject = ['$rootScope', '$scope', 'autocompleteService', 'miscellaneousService', 'Employee'];

  function projectEmployeesController($rootScope, $scope, autocompleteService, miscellaneousService, Employee) {

    var vm = this;
    vm.searchText = '';
    vm.disableEmployeeCard = true;
    vm.employees = [];



    // Public methods
    //--------------------------------------------------------------

    vm.saveProject = saveProject;
    vm.querySearchEmployee = querySearchEmployee;
    vm.addEmployee = addEmployee;
    vm.removeEmployee = removeEmployee;



    //Private methods
    //---------------------------------------------------------------

    var getProjects = $rootScope.$on('projectIsLoadedEvent', function(event, project) {
      vm.project = project;
    });

    $scope.$on('$destroy', function() {
      getProjects();
    });

    getEmployees();



    // Private methods declarations
    //--------------------------------------------------------------------

    function getEmployees() {
      Employee.getAll().then(
        function(data) {
          vm.employees = data;
          // updateAutocompleteEmployees();
          autocompleteService.buildList(vm.employees, ['firstName', 'lastName']);

        },
        function(data) {});
    }

    function updateAutocompleteEmployees() {
      var i = 0;
      var indexEmployeeToRemove = '';

      for (i; i < vm.project.employees.length; i++) {
        indexEmployeeToRemove = miscellaneousService
          .getItemIndex(vm.employees, vm.project.employees[i].id);
        vm.employees.splice(indexEmployeeToRemove, 1);
      }
    }


    // Public methods declarations
    //-------------------------------------------------------------------

    function saveProject(project) {
      $rootScope.$emit("callSaveMethodCardsProjects", project);
      vm.disableEmployeeCard = true;
    }

    function querySearchEmployee(query) {
      return autocompleteService.querySearch(query, vm.employees);
    }

    function addEmployee(item, project) {

      var employeeIndex = '';

      if (item) {
        employeeIndex = miscellaneousService.getItemIndex(vm.employees, item.id);
        vm.employees.splice(employeeIndex, 1);
        vm.project.employees.push(item);
        vm.searchText = "";
      }
      return;

    }

    function removeEmployee(item, project, index) {
      // var employeeIndex = miscellaneousService.getItemIndex(vm.project.employees, item);
      // vm.employees.unshift(vm.project.employees[employeeIndex]);
      vm.project.employees.splice(index, 1);
    }

  }

}());
