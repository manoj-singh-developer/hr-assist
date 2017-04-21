((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('userProjectsCtrl', userProjectsCtrl);

  userProjectsCtrl
    .$inject = ['$rootScope', 'autocompleteService', 'Project', 'User'];

  function userProjectsCtrl($rootScope, autocompleteService, Project, User) {

    let vm = this;
    let projectsToAdd = [];
    let projectsToRemove = [];
    vm.user = {};
    vm.projects = [];
    vm.userProjects = [];

    vm.addNewProject = addNewProject;

    vm.addInQueue = addInQueue;
    vm.removeFromQueue = removeFromQueue;
    vm.save = save;

    vm.deleteProject = deleteProject;
    _getProjects();

    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.user = data.user;
      vm.userProjects = data.projects;
      _getUserProjects();
    });

    function addNewProject() {
      if (!vm.projectsToAdd) {
        vm.projectsToAdd = [];
      }
      vm.projectsToAdd.push({});

    }

    function addInQueue(project) {
      if (project) {
        let toRemove = _.findWhere(projectsToRemove, { id: project.id });
        projectsToRemove = _.without(projectsToRemove, toRemove);
        projectsToAdd.push(project);
        vm.userProjects.push(project);
      }
    }

    function removeFromQueue(project) {
      let toRemove = _.findWhere(vm.userProjects, { id: project.id });
      vm.userProjects = _.without(vm.userProjects, toRemove);
      projectsToAdd = _.without(projectsToAdd, toRemove);
      projectsToRemove.push(project);
    }

    function save() {

      if (projectsToAdd.length) {
        User.updateProjects(vm.user, projectsToAdd)
          .then(() => {
            _getUserProjects();
            vm.toggleForm();
          });
      }

      if (projectsToRemove.length) {
        User.removeLanguages(vm.user, projectsToRemove)
          .then(() => {
            _getUserProjects();
            vm.toggleForm();
          });
      }
    }

    function deleteProject(project) {
      User.removeProjects(vm.user, project).then(() => {
        _getUserProjects();
      });
    }

    function _getProjects() {
      Project.getAll().then((data) => {
        vm.projects = data;
        autocompleteService.buildList(vm.projects, ['name']);
      });
    }

    function _getUserProjects() {
      User.getProjects(vm.user).then((data) => {
        vm.userProjects = data;
      });
    }

  }

})(_);
