(function() {

  'use strict';

  // @WORK IN PROGRESS
  // Am inceput refactory aici dar nu am mai termina

  // ------------------------------------------------------------------------
  // @userProjectsCtrl
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('userProjectsCtrl', userProjectsCtrl);

  userProjectsCtrl
    .$inject = ['$rootScope', '$scope', '$stateParams','Project', 'User', 'autocompleteService', 'miscellaneousService', '$location', '$log'];





  function userProjectsCtrl($rootScope, $scope, $stateParams, Project, User, autocompleteService, miscellaneousService, $location, $log) {

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
    vm.saveProjectToUser = saveProjectToUser;





    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    $rootScope.$on('event:userResourcesLoaded', function(event, userResources, user) {

      vm.user = user;

      if (userResources.projects) {
        setAllProjects(userResources.projects);
      }
      setAllSkills(userResources.skills);

    });

    $rootScope.$on('event:userDetailsUpdated', function(event, user) {

      debugger;

    });





    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function toggleCard(event, action) {

      var card = angular
        .element(event.currentTarget)
        .closest('.js-user-card');

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

    function saveProjectToUser(currentProject) {


      var userToUpdate = angular.copy(vm.user);

      if (vm.isNewProject) {
        userToUpdate.projects.push(currentProject);
      }



      $rootScope.$emit("callSaveMethodCards", userToUpdate);

      // saveuser(vm.user);

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

    function saveuser(user) {
      $rootScope.$emit("callSaveMethodCards", user);
    }





    // ----------------------------------------------------------------------
    // PRIVATE METHODS DECLARATION
    // ----------------------------------------------------------------------

    function setAllProjects(projects) {
      vm.allProjects = projects;
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
