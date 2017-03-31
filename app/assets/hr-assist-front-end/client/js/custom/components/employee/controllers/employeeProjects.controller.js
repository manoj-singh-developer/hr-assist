(function() {

  'use strict';

  // @WORK IN PROGRESS
  // Am inceput refactory aici dar nu am mai termina

  // ------------------------------------------------------------------------
  // @employeeProjectController
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('employeeProjectController', employeeProjectController);

  employeeProjectController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'ProjectModel', 'Employee', 'autocompleteService', 'miscellaneousService', '$location', '$log'];





  function employeeProjectController($rootScope, $scope, $stateParams, ProjectModel, Employee, autocompleteService, miscellaneousService, $location, $log) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    var techIndex = 0;

    vm.isNewProject = null; // If true we are adding a new project to the list
    vm.showForm = false;
    vm.disabledProjects = true;
    vm.projectIncrement = [];
    vm.techIncrement = [];
    vm.searchedProject = ''; // this should be string for autocomplete to work
    vm.searchTech = [];
    vm.allProjects = [];
    vm.projectDate = [];
    vm.project = [];
    vm.techs = [];
    vm.acc = [];
    vm.copyCat = [];
    vm.allTech = [];
    vm.selectedProject = '';

    vm.projectIntervalDefault = {
      'from': null,
      'to': null,
      'technologies': null
    };

    vm.currentProjectDefault = {
      id: null,
      projectDates: null,
    };

    vm.currentProject = angular.copy(vm.currentProjectDefault);
    vm.currentProject.projectDates = angular.copy(vm.projectIntervalDefault);





    // ----------------------------------------------------------------------
    // EXPOSED PUBLIC METHODS
    // ----------------------------------------------------------------------

    vm.addEmptyProject = addEmptyProject;
    vm.selectedProjectChanged = selectedProjectChanged;

    vm.editProject = editProject;


    vm.addNewTechnology = addNewTechnology;
    vm.querySearchProject = querySearchProject;
    vm.querySearchTech = querySearchTech;
    vm.addEmptyTechnology = addEmptyTechnology;
    vm.toggleCard = toggleCard;
    vm.saveProjectToEmployee = saveProjectToEmployee;





    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    $rootScope.$on('event:employeeResourcesLoaded', function(event, employeeResources, employee) {

      vm.employee = employee;

      if (employeeResources.projects) {
        setAllProjects(employeeResources.projects);
      }
      setAllSkills(employeeResources.skills);

    });

    $rootScope.$on('event:employeeDetailsUpdated', function(event, employee) {

      debugger;

    });





    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function toggleCard(event, action) {

      var card = angular
        .element(event.currentTarget)
        .closest('.js-employee-card');

      $rootScope.$emit("event:toggleCard", card, action);

    }


    function addEmptyProject() {

      vm.isNewProject = true;
      vm.showForm = true;

    }

    function editProject(project) {

      vm.searchedProject = project.name;
      vm.currentProject = project;
      vm.showForm = true;
      vm.isNewProject = false;

    }


    function selectedProjectChanged(project) {

      if (vm.isNewProject) {
        vm.currentProject = project;
      }

    }

    function saveProjectToEmployee(currentProject) {


      var employeeToUpdate = angular.copy(vm.employee);

      if (vm.isNewProject) {
        employeeToUpdate.projects.push(currentProject);
      }



      $rootScope.$emit("callSaveMethodCards", employeeToUpdate);

      // saveEmployee(vm.employee);

    }



    function addNewTech(indP) {
      if (!vm.acc[indP]) {
        vm.acc[indP] = [];
        vm.acc[indP][techIndex] = "";
      } else {
        techIndex = vm.acc[indP].length;
        vm.acc[indP][techIndex] = "";
      }
    }

    // function changeProjectView() {
    //   vm.disabledProjects = false;
    // }

    function querySearchProject(query) {
      return autocompleteService.querySearch(query, vm.allProjects);
    }

    function querySearchTech(query) {
      return autocompleteService.querySearch(query, vm.allTechnologies);
    }

    function saveEmployee(employee) {

      $rootScope.$emit("callSaveMethodCards", employee);

    }





    // ----------------------------------------------------------------------
    // PRIVATE METHODS DECLARATION
    // ----------------------------------------------------------------------

    function setAllProjects(projects) {
      vm.allProjects = projects; // undefined projects
      // debugger
      return autocompleteService.buildList(vm.allProjects, ['name']);

    }


    function setAllSkills(technologies) {

      vm.allTechnologies = technologies;

    }


    function addNewTechnology(technology, index) {

      vm.currentProject.projectDates[index] = technology;

    }

    function addEmptyTechnology(index) {
      vm.currentProject.projectDates[index] = {};
    }

  }

}());
